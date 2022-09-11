import { ForbiddenException, Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { Prisma, User } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import * as radash from "radash";
import * as argon2 from "argon2";
import { v4 } from "uuid";

import { PrismaService } from "../prisma/prisma.service";
import { AUTH_ERROR } from "../auth/constants";
import { RedisCacheService } from "../cache/redisCache.service";

const USER_FIELDS: Prisma.UserSelect = {
  email: true,
  username: true,
  id: true,
};

const USER_HASH_FIELDS: Prisma.UserSelect = {
  ...USER_FIELDS,
  hash: true,
  hashRt: true,
};

const UPDATE_ERROR = "Unable to reset password";

type UpdateableUserFields = Partial<
  Pick<User, "username" | "email" | "hashRt" | "hash">
>;

type CacheableResetEmail = {
  userId: number;
  username: string;
  email: string;
};

const RESET_PASSWORD_EMAIL_PREFIX = "reset-password-email:";

@Injectable({})
export class UserService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private cache: RedisCacheService,
    private mailerService: MailerService
  ) {}

  async find({
    id,
    email,
    username,
    includeHash = false,
  }: {
    id?: number;
    email?: string;
    username?: string;
    includeHash?: boolean;
  }) {
    if (id) {
      return this.findById(id, includeHash);
    }
    if (email) {
      return this.findByEmail(email, includeHash);
    }
    if (username) {
      return this.findByUsername(username, includeHash);
    }
  }

  /**
   * Finds the ONLY user with the provided ID
   * @param id id of user to find
   * @returns [`Err`, `User`]
   */
  async findById(id: number, includeHash = false) {
    const res = await radash.try(this.prisma.user.findUnique)({
      where: { id },
      select: includeHash ? USER_HASH_FIELDS : USER_FIELDS,
    });
    return res;
  }

  /**
   * Finds the ONLY user with the provided email
   * @param email email of user to find
   * @returns [`Err`, `User`]
   */
  async findByEmail(email: string, includeHash = false) {
    const res = await radash.try(this.prisma.user.findUnique)({
      where: { email },
      select: includeHash ? USER_HASH_FIELDS : USER_FIELDS,
    });
    return res;
  }

  /**
   * Finds the ONLY user with the provided username
   * @param username username of user to find
   * @returns [`Err`, `User`]
   */
  async findByUsername(username: string, includeHash = false) {
    const res = await radash.try(this.prisma.user.findUnique)({
      where: { username },
      select: includeHash ? USER_HASH_FIELDS : USER_FIELDS,
    });
    return res;
  }

  /**
   * Finds the FIRST user with the provided username OR email
   * @param email email of user to find
   * @param username of user to find
   * @returns [`Err`, `User`]
   */
  async findFirstByEitherUniqueFields(email: string, username: string) {
    const res = await radash.try(this.prisma.user.findFirst)({
      where: { OR: [{ username }, { email }] },
      select: USER_FIELDS,
    });
    return res;
  }

  /**
   * Updates the username/email/refresh token hash of an existing user in the database
   * @param id id of user to be updated
   * @param fields updateable fields for user object (username, email, refresh token hash)
   * @returns [`Err`, `User`]
   */
  async update(id: number, fields: UpdateableUserFields) {
    const res = await radash.try(this.prisma.user.update)({
      where: { id },
      data: fields,
      select: USER_FIELDS,
    });
    return res;
  }

  /**
   * Clears the refresh token hash of a given user
   * @param id id of user to clear refresh token
   * @returns [`Err`, `User`]
   */
  async clearRefreshToken(id: number) {
    const res = await radash.try(this.prisma.user.updateMany)({
      where: { id, hashRt: { not: null } },
      data: { hashRt: null },
    });
    return res;
  }

  /**
   * Creates a new user in the database
   * @param email email of user
   * @param username username of user
   * @param password password of user
   * @returns [`Err`, `User`]
   */
  async create(email: string, username: string, password: string) {
    const hash = await argon2.hash(password);
    return this.createWithHash(email, username, hash);
  }

  /**
   * Creates a new user in the database with hash
   * @param email email of user
   * @param username username of user
   * @param hash hash of user
   * @returns [`Err`, `User`]
   */
  async createWithHash(email: string, username: string, hash: string) {
    const res = await radash.try(this.prisma.user.create)({
      data: {
        email,
        username,
        hash,
      },
      select: USER_FIELDS,
    });
    return res;
  }

  /**
   * Deletes a user from the database
   * @param id id of user to be delete
   * @returns [`Err`, `User`]
   */
  async delete(id: number) {
    const res = await radash.try(this.prisma.user.delete)({
      where: { id },
      select: USER_FIELDS,
    });
    return res;
  }

  /**
   * Sends the user a reset password email and returns the JWT token
   * @param email the email account that requested for a password reset
   */
  async resetPassword(email: string) {
    // find user via email provided
    const [err, user] = await this.findByEmail(email);
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
    const [err, user] = await this.findByEmail(email, true);

    if (err || !user) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_USER);
    }

    //Update new password in the database
    const hashedNewPassword = await argon2.hash(newPassword);

    const [error, userToReset] = await this.update(userId, {
      hash: hashedNewPassword,
    });

    if (error || !userToReset) {
      throw new ForbiddenException(UPDATE_ERROR);
    }
  }
}
