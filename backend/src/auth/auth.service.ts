import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User } from "@prisma/client";
import * as argon2 from "argon2";

import { CredentialsDto } from "../zod";
import { AUTH_ERROR } from "./constants";
import { UserService } from "../user/user.service";

export type JwtPayload = {
  sub: number;
  email: string;
};

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

@Injectable({})
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private users: UserService
  ) {}

  /**
   * Creates a new user object in the database and returns the JWT token
   * @param credentials credentials validated by zod schema
   * @returns jwt token associated with the new user
   */
  async signup(credentials: CredentialsDto): Promise<Tokens> {
    const { email, username, password } = credentials;

    // save new user in db
    // const [err, user] = await this.users.find({ email, username });
    const [err, user] = await this.users.create(email, username, password);

    // if user already exists, throw exception
    if (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new ForbiddenException(AUTH_ERROR.UNAVAILABLE_CREDENTIALS);
        }
      }
      throw err;
    }

    // generate tokens for new user
    const tokens = await this.signTokens(user.id, user.email);
    // update refresh token hash for new user
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  /**
   * Authenticates user and returns the JWT token
   * @param credentials credentials validated by zod schema
   * @returns jwt token associated with the authenticated user
   */
  async signin(credentials: CredentialsDto): Promise<Tokens> {
    const { email, username, password } = credentials;

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

  async signout(id: number) {
    const [err, _] = await this.users.clearRefreshToken(id);
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
    const [err, _] = await this.users.update(id, { hashRt });
    // throw if err updating refresh token hash
    if (err) {
      throw err;
    }
    return;
  }
}
