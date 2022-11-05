import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import axios from "axios";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as argon2 from "argon2";
import { v4 } from "uuid";

import { NAMESPACES } from "shared/api";
import { AUTH_ERROR, VERIFY_EMAIL_OPTIONS } from "../utils/constants";
import { UserService } from "../user/user.service";
import { RedisCacheService } from "../cache/redisCache.service";
import { ThrowKnownPrismaErrors } from "src/utils";
import {
  SigninCredentialsDto,
  SignupCredentialsDto,
  OauthDto,
} from "./auth.dto";

export type JwtPayload = {
  sub: number;
  email: string;
};

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

type CacheableUserFields = {
  email: string;
  username: string;
  hash: string;
};

type CacheableResetEmail = {
  userId: number;
  username: string;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private users: UserService,
    private cache: RedisCacheService,
    private mailerService: MailerService
  ) {}

  /**
   * Creates a new user object in the cache and send an verification email
   * @param credentials credentials validated by zod schema
   */
  async signup(credentials: SignupCredentialsDto) {
    const { email, username, password } = credentials;

    // check if user's email and username in db
    const [, user] = await this.users.findFirstByEitherUniqueFields(
      email,
      username
    );

    if (user) {
      if (user.email === email) {
        throw new ForbiddenException(AUTH_ERROR.UNAVAILABLE_EMAIL);
      } else {
        throw new ForbiddenException(AUTH_ERROR.UNAVAILABLE_USERNAME);
      }
    }

    const cachedEmail = await this.cache.getKeyInNamespace(
      [NAMESPACES.AUTH],
      email
    );
    if (!!cachedEmail) {
      throw new ForbiddenException(AUTH_ERROR.UNVERIFIED_EMAIL);
    }

    // user can be created
    const emailVerificationToken = v4();
    const hash = await argon2.hash(password);

    // store user information in cache within the AUTH namespace
    await this.cache.setKeyInNamespace<CacheableUserFields>(
      [NAMESPACES.AUTH],
      emailVerificationToken,
      { hash, email, username }
    );
    await this.cache.setKeyInNamespace<string>(
      [NAMESPACES.AUTH],
      email,
      emailVerificationToken
    );

    // send email
    await this.mailerService
      .sendMail({
        to: email,
        subject: VERIFY_EMAIL_OPTIONS.subject,
        template: VERIFY_EMAIL_OPTIONS.template, // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          token: emailVerificationToken,
          username: username,
          url: this.config.get("FRONTEND_URL"),
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.error(err);
        throw new HttpException(
          "Internal Server Error",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });
  }

  /**
   * Authenticates user and returns the JWT token
   * @param credentials credentials validated by zod schema
   * @returns jwt token associated with the authenticated user
   */
  async signin(credentials: SigninCredentialsDto): Promise<Tokens> {
    const { email, password } = credentials;

    // check if email is unverified
    const cachedEmail = await this.cache.getKeyInNamespace(
      [NAMESPACES.AUTH],
      email
    );
    if (!!cachedEmail) {
      throw new ForbiddenException(AUTH_ERROR.UNVERIFIED_EMAIL);
    }

    // find user via username + email provided
    const [err, user] = await this.users.find({ email, includeHash: true });

    ThrowKnownPrismaErrors(err);

    // if user doesn't exist, throw exception
    if (!user) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_CREDENTIALS);
    }

    //If user is an oauth user trying to sign in via normal login
    if (user.provider !== "CUSTOM") {
      throw new NotFoundException(AUTH_ERROR.INVALID_USER);
    }
    // if password incorrect, throw exception
    const isPasswordCorrect = await argon2.verify(user.hash, password);
    if (!isPasswordCorrect) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_CREDENTIALS);
    }

    // if password correct, generate tokens
    const tokens = await this.signTokens(user.id, user.email);
    // update refresh token hash for logged in user
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async verifyEmail(token: string): Promise<Tokens> {
    const cachedUser = await this.cache.getKeyInNamespace<CacheableUserFields>(
      [NAMESPACES.AUTH],
      token
    );
    if (!cachedUser) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_EMAIL_VERIFY_EMAIL_TOKEN);
    }

    console.log("cached user: ", { cachedUser });

    const { username, email, hash } = cachedUser;
    const [err, user] = await this.users.createWithHash(email, username, hash);

    // if user already exists, throw exception
    if (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new ForbiddenException(AUTH_ERROR.UNAVAILABLE_CREDENTIALS);
        }
      }
      ThrowKnownPrismaErrors(err);
    }

    // clear new user in cache
    await this.cache.deleteKeyInNamespace([NAMESPACES.AUTH], token);
    await this.cache.deleteKeyInNamespace([NAMESPACES.AUTH], email);

    // generate tokens for new user
    const tokens = await this.signTokens(user.id, user.email);

    console.log("new tokens: ", { tokens });

    // update refresh token hash for new user
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async signout(id: number) {
    const [err] = await this.users.clearRefreshToken(id);
    if (err) {
      ThrowKnownPrismaErrors(err);
    }
    return;
  }

  async refreshTokens(id: number, email: string): Promise<Tokens> {
    // if password correct, generate tokens
    const tokens = await this.signTokens(id, email);
    // update refresh token hash for logged in user
    await this.updateRefreshTokenHash(id, tokens.refresh_token);
    return tokens;
  }

  /**
   * Generates a JWT access + refresh tokens for a user given the ID and email
   * @param id id of user
   * @param email email of user
   * @returns signed JWT access + refresh tokens
   */
  async signTokens(id: number, email: string): Promise<Tokens> {
    // get secrets
    const jwtSecret = this.config.getOrThrow("JWT_SECRET");
    const refreshSecret = this.config.getOrThrow("JWT_REFRESH_SECRET");
    // create payload
    const payload: JwtPayload = {
      sub: id,
      email,
    };
    // generate tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, { expiresIn: "15m", secret: jwtSecret }),
      this.jwt.signAsync(payload, {
        expiresIn: "7d",
        secret: refreshSecret,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshTokenHash(id: number, refreshToken: string) {
    const hashRt = await argon2.hash(refreshToken);
    const [err] = await this.users.update(id, { hashRt });
    // throw if err updating refresh token hash
    if (err) {
      console.log("error occurred while refreshing token hash!");
      ThrowKnownPrismaErrors(err);
    }
    return;
  }

  /**
   * Sends the user a reset password email and returns the JWT token
   * @param email the email account that requested for a password reset
   */
  async resetPassword(email: string) {
    // find user via email provided
    const [err, user] = await this.users.findByEmail(email);
    // if user doesn't exist, do nothing. Just bring user to email sent page
    if (err || !user) {
      return;
    }

    const username = user.username;
    const userId = user.id;

    // reset password
    const resetPasswordVerificationToken = v4();
    await this.cache.setKeyInNamespace<CacheableResetEmail>(
      [NAMESPACES.AUTH],
      resetPasswordVerificationToken,
      {
        userId,
        username,
        email,
      }
    );

    // send email
    await this.mailerService
      .sendMail({
        to: email,
        subject: "Email Verification for resetting of password ✔",
        template: "resetPasswordVerification", // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          code: resetPasswordVerificationToken,
          username: username,
          url: this.config.get("FRONTEND_URL"),
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        ThrowKnownPrismaErrors(err);
      });
  }

  async verifyResetEmail(token: string, newPassword: string) {
    const cachedUser = await this.cache.getKeyInNamespace<CacheableResetEmail>(
      [NAMESPACES.AUTH],
      token
    );
    if (!cachedUser) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_EMAIL_VERIFY_EMAIL_TOKEN);
    }

    // clear the email that requested for a reset in cache
    await this.cache.deleteKeyInNamespace([NAMESPACES.AUTH], token);

    // check whether there is a user associated with the token
    const { userId, email } = cachedUser;
    const [err, user] = await this.users.findByEmail(email, true);

    ThrowKnownPrismaErrors(err);

    if (!user) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_USER);
    }

    // update new password in the database
    const hashedNewPassword = await argon2.hash(newPassword);
    const [error, userToReset] = await this.users.update(userId, {
      hash: hashedNewPassword,
    });

    if (error || !userToReset) {
      throw new ForbiddenException(AUTH_ERROR.UPDATE_ERROR);
    }
  }

  async changePassword(id: number, oldPassword: string, newPassword: string) {
    // find user via id provided
    const [err, user] = await this.users.find({ id, includeHash: true });

    ThrowKnownPrismaErrors(err);

    // if user doesn't exist, throw exception
    if (!user) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_CREDENTIALS);
    }

    // if old password incorrect, throw exception
    const isPasswordCorrect = await argon2.verify(user.hash, oldPassword);
    if (!isPasswordCorrect) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_CREDENTIALS);
    }

    // update new password in the database
    const hashedNewPassword = await argon2.hash(newPassword);
    const [error, userToChangePassword] = await this.users.update(id, {
      hash: hashedNewPassword,
    });

    if (error || !userToChangePassword) {
      throw new ForbiddenException(AUTH_ERROR.UPDATE_ERROR);
    }
  }

  async deleteAccount(id: number, password: string) {
    // find user via id provided
    const [err, user] = await this.users.find({ id, includeHash: true });

    ThrowKnownPrismaErrors(err);

    // if user doesn't exist, throw exception
    if (!user) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_CREDENTIALS);
    }

    // if password incorrect, throw exception
    const isPasswordCorrect = await argon2.verify(user.hash, password);
    if (!isPasswordCorrect) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_CREDENTIALS);
    }

    // delete user
    const [error, userToDelete] = await this.users.delete(id);

    if (error || !userToDelete) {
      throw new ForbiddenException(AUTH_ERROR.UPDATE_ERROR);
    }
  }

  async getGithubUser({ oauthCode }: { oauthCode: string }) {
    const githubClientId = this.config.getOrThrow("OAUTH_GITHUB_CLIENT_ID");
    const githubClientSecret = this.config.getOrThrow(
      "OAUTH_GITHUB_CLIENT_SECRET"
    );

    // get github token
    const githubToken = await axios
      .post(
        `https://github.com/login/oauth/access_token?client_id=${githubClientId}&client_secret=${githubClientSecret}&code=${oauthCode}`
      )
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
    const decoded = new URLSearchParams(githubToken);
    const accessToken = decoded.get("access_token");

    // fetch username from github
    const username: string = await axios
      .get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => res.data.login)
      .catch((error) => {
        console.error(`Error getting user from GitHub`);
        throw error;
      });

    // fetch email from github
    const primaryEmail: string = await axios
      .get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => res.data[0].email)
      .catch((error) => {
        console.error(`Error getting user from GitHub`);
        throw error;
      });

    return {
      username: username,
      email: primaryEmail,
    };
  }

  async checkOauthLogins(email: string, username: string) {
    // check whether user's email is registered
    const [err, user] = await this.users.findFirstByEitherUniqueFields(
      email,
      username
    );

    // create user if it doesnt exist
    if (err || !user) {
      this.users.createOauthUser(email, username);
      return;
    }

    // check whether the user created account using peerprep login
    if (user.email === email && user.provider === "CUSTOM") {
      throw new ForbiddenException(AUTH_ERROR.UNAVAILABLE_EMAIL);
      // is username in use
    } else if (user.username === username && user.provider === "CUSTOM") {
      throw new ForbiddenException(AUTH_ERROR.UNAVAILABLE_USERNAME);
    }

    const cachedEmail = await this.cache.getKeyInNamespace(
      [NAMESPACES.AUTH],
      email
    );
    if (!!cachedEmail) {
      console.log("email in process of verification!");
      throw new ForbiddenException(AUTH_ERROR.UNVERIFIED_EMAIL);
    }
  }

  /**
   * Authenticates user and returns the JWT token
   * @param credentials credentials validated by zod schema
   * @returns jwt token associated with the authenticated user
   */
  async signinOauth(credentials: OauthDto): Promise<Tokens> {
    const { email } = credentials;
    const [err, user] = await this.users.findByEmail(email);
    if (err || !user) {
      ThrowKnownPrismaErrors(err);
      return;
    }
    const tokens = await this.signTokens(user.id, user.email);
    // update refresh token hash for logged in user
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }
}
