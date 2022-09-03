import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";

import { CredentialsDto } from "../zod";
import { PrismaService } from "../prisma/prisma.service";
import { AUTH_ERROR } from "./constants";
import { UserService } from "../user/user.service";

export type JwtPayload = {
  sub: number;
  email: string;
};

export type AccessToken = {
  access_token: string;
};

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private users: UserService
  ) {}

  /**
   * Creates a new user object in the database and returns the JWT token
   * @param credentials credentials validated by zod schema
   * @returns jwt token associated with the new user
   */
  async signup(credentials: CredentialsDto): Promise<AccessToken> {
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

    const token = await this.signToken(user.id, user.email);
    return { access_token: token };
  }

  /**
   * Authenticates user and returns the JWT token
   * @param credentials credentials validated by zod schema
   * @returns jwt token associated with the authenticated user
   */
  async signin(credentials: CredentialsDto): Promise<AccessToken> {
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

    const token = await this.signToken(user.id, user.email);
    return { access_token: token };
  }

  /**
   * Generates a JWT token for a user given the ID and email
   * @param userId id of user
   * @param email email of user
   * @returns a signed JWT token
   */
  async signToken(userId: number, email: string): Promise<string> {
    const secret = this.config.getOrThrow("JWT_SECRET");
    const payload: JwtPayload = {
      sub: userId,
      email,
    };
    return this.jwt.signAsync(payload, {
      expiresIn: "15m",
      secret,
    });
  }
}
