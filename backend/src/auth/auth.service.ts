import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as argon2 from "argon2";
import { v4 } from "uuid";

import { AUTH_ERROR, VERIFY_EMAIL_OPTIONS } from "./constants";
import { UserService } from "../user/user.service";
import { SigninCredentialsDto, SignupCredentialsDto } from "../utils/zod";
import { RedisCacheService } from "../cache/redisCache.service";

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

@Injectable({})
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
      if (user.email == email) {
        throw new ForbiddenException(AUTH_ERROR.UNAVAILABLE_EMAIL);
      } else {
        throw new ForbiddenException(AUTH_ERROR.UNAVAILABLE_USERNAME);
      }
    }

    const cachedEmail = await this.cache.get(email);
    if (!!cachedEmail) {
      throw new ForbiddenException(AUTH_ERROR.UNVERIFIED_EMAIL);
    }

    // user can be created
    const emailVerificationToken = v4();
    const hash = await argon2.hash(password);

    // store user information in cache
    await this.cache.set<CacheableUserFields>(emailVerificationToken, {
      hash,
      email,
      username,
    });
    await this.cache.set<string>(email, emailVerificationToken);

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
        console.log(err);
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
    const cachedEmail = await this.cache.get(email);
    if (!!cachedEmail) {
      throw new ForbiddenException(AUTH_ERROR.UNVERIFIED_EMAIL);
    }

    // find user via username + email provided
    const [err, user] = await this.users.find({ email, includeHash: true });
    // if user doesn't exist, throw exception
    if (err || !user) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_CREDENTIALS);
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

  async verifyEmail(token: string) {
    const cachedUser = await this.cache.get<CacheableUserFields>(token);
    if (!cachedUser) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_EMAIL_VERIFY_EMAIL_TOKEN);
    }

    const { username, email, hash } = cachedUser;

    const [err, user] = await this.users.createWithHash(email, username, hash);

    // if user already exists, throw exception
    if (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new ForbiddenException(AUTH_ERROR.UNAVAILABLE_CREDENTIALS);
        }
      }
      throw err;
    }

    // clear new user in cache
    await this.cache.del(token);
    await this.cache.del(email);

    // generate tokens for new user
    const tokens = await this.signTokens(user.id, user.email);
    // update refresh token hash for new user
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async signout(id: number) {
    const [err] = await this.users.clearRefreshToken(id);
    if (err) {
      throw err;
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
      throw err;
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
    const username = user.username;
    const userId = user.id;

    // if user doesn't exist, do nothing. Just bring user to email sent page
    if (err || !user) {
      return;
    }

    //Reset password
    const resetPasswordVerificationToken = v4();

    await this.cache.set<CacheableResetEmail>(resetPasswordVerificationToken, {
      userId,
      username,
      email,
    });

    //Send email
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
        console.log(err);
      });
  }

  async verifyResetEmail(token: string, newPassword: string) {
    const cachedUser = await this.cache.get<CacheableResetEmail>(token);
    if (!cachedUser) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_EMAIL_VERIFY_EMAIL_TOKEN);
    }

    // clear the email that requested for a reset in cache
    await this.cache.del(token);

    const { userId, email } = cachedUser;

    //Check whether there is a user associated with the token
    const [err, user] = await this.users.findByEmail(email, true);

    if (err || !user) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_USER);
    }

    //Update new password in the database
    const hashedNewPassword = await argon2.hash(newPassword);

    const [error, userToReset] = await this.users.update(userId, {
      hash: hashedNewPassword,
    });

    if (error || !userToReset) {
      throw new ForbiddenException(AUTH_ERROR.UPDATE_ERROR);
    }
  }
}
