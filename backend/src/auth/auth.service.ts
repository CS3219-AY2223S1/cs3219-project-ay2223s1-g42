import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";
import * as argon2 from "argon2";
import { v4 } from "uuid";

import { AUTH_ERROR } from "./constants";
import { UserService } from "../user/user.service";
import { SigninCredentialsDto, SignupCredentialsDto } from "../utils/zod";
import { RedisCacheService } from "../cache/redisCache.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

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

const VERIFY_EMAIL_PREFIX = "verify-email:";
const EMAIL_PREFIX = "email:";
const USERNAME_PREFIX = "username:";

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

    // check if username in cache, throw username in use
    const isUsernameInCache = !!(await this.cache.get(
      USERNAME_PREFIX + username
    ));
    if (isUsernameInCache) {
      throw new ForbiddenException(AUTH_ERROR.UNAVAILABLE_USERNAME);
    }

    const isEmailInCache = !!(await this.cache.get(EMAIL_PREFIX + email));
    if (isEmailInCache) {
      throw new ForbiddenException(AUTH_ERROR.UNVERIFIED_EMAIL);
    }

    // user can be created
    const emailVerificationToken = VERIFY_EMAIL_PREFIX + v4();
    const hash = await argon2.hash(password);

    // store user information in cache
    await this.cache.set<CacheableUserFields>(emailVerificationToken, {
      hash,
      email,
      username,
    });
    await this.cache.set<string>(EMAIL_PREFIX + email, emailVerificationToken);
    await this.cache.set<string>(
      USERNAME_PREFIX + username,
      emailVerificationToken
    );

    // send email
    await this.mailerService
      .sendMail({
        to: email,
        subject: "Email Verification",
        template: "emailVerification", // The `.pug` or `.hbs` extension is appended automatically.
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
    await this.cache.del(username);
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
}
