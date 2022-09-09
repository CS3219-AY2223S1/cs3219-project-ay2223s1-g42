import { ForbiddenException, Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { Prisma, User } from "@prisma/client";
import * as radash from "radash";
import * as argon2 from "argon2";
import { randomBytes } from "crypto";
import { v4 } from "uuid";

import { PrismaService } from "../prisma/prisma.service";
import { AUTH_ERROR } from "../auth/constants";
import { RedisCacheService } from "../cache/redisCache.service";
import { hashPassword, verifyPassword } from "../../../user-service/utils/salt_password";

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

type UpdateableUserFields = Partial<
  Pick<User, "username" | "email" | "hashRt">
>;

type CacheableResetEmail = {
  email: string;
};

const RESET_PASSWORD_PREFIX = "reset-password:";
const RESET_PASSWORD_EMAIL_PREFIX = "reset-password-email:";

@Injectable({})
export class UserService {
  constructor(
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
   * Updates the username/email/refresh token hash of an existing user in the database
   * @param id id of user to be updated
   * @param fields updateable fields for user object (username, email, refresh token hash)
   * @returns [`Err`, `User`]
   */
  async updateResetPassword(id: number, temporaryPassword: string) {
    const res = await radash.try(this.prisma.user.update)({
      where: { id },
      data: { hash: await hashPassword(temporaryPassword) },
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
  async updatePasswordWithHash(id: number, newPassword: string) {
    const res = await radash.try(this.prisma.user.update)({
      where: { id },
      data: { hash: await hashPassword(newPassword) },
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

    // if user doesn't exist, do nothing. Just bring user to email sent page
    if (err || !user) {
      return;
    }

    // check if email in cache, print out that the reset mail has already been sent
    const isEmailInCache = !!(await this.cache.get(
      RESET_PASSWORD_EMAIL_PREFIX + email
    ));
    if (isEmailInCache) {
      throw new ForbiddenException(AUTH_ERROR.RESET_EMAIL_ALREADY_SENT);
    }

    //Reset password
    const resetPasswordVerificationToken = RESET_PASSWORD_PREFIX + v4();
    await this.cache.set<CacheableResetEmail>(resetPasswordVerificationToken, {
      email,
    });

    //Generate a random temporary password for user of length 16
    const temporaryPassword = randomBytes(16).toString();

    const [error, userToReset] = await this.updateResetPassword(
      user.id,
      temporaryPassword
    );

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
          newPassword: temporaryPassword,
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async verifyResetEmail(token: string, confirmationPassword: string, newPassword: string) {
    const cachedUser = await this.cache.get<CacheableResetEmail>(token);
    if (!cachedUser) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_EMAIL_VERIFY_EMAIL_TOKEN);
    }

    const { email } = cachedUser;
    const [err, user] = await this.findByEmail(email);
    const userId = user.id;
    const currentPassword = user.hash;

    //Check whether password entered matches the password in the email
    const isPasswordCorrect = await verifyPassword(currentPassword, confirmationPassword);

    if (!isPasswordCorrect) {
      throw new ForbiddenException(AUTH_ERROR.INVALID_CREDENTIALS);
    }
    
    const [error, userToReset] = await this.updatePasswordWithHash(
      userId,
      newPassword
    );

    // clear the email that requested for a reset in cache
    await this.cache.del(email);
  }
}
