import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import * as radash from "radash";
import * as argon2 from "argon2";

import { UserHashInfo, UserInfo } from "shared/api";
import { PrismaService } from "../prisma/prisma.service";

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
  Pick<User, "username" | "email" | "hashRt" | "hash">
>;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
  }): Promise<[Error, UserInfo & UserHashInfo]> {
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
  async findById(
    id: number,
    includeHash = false
  ): Promise<[Error, UserInfo & UserHashInfo]> {
    const res = await radash.try(this.prisma.user.findUniqueOrThrow)({
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
  async findByEmail(
    email: string,
    includeHash = false
  ): Promise<[Error, UserInfo & UserHashInfo]> {
    const res = await radash.try(this.prisma.user.findUniqueOrThrow)({
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
  async findByUsername(
    username: string,
    includeHash = false
  ): Promise<[Error, UserInfo & UserHashInfo]> {
    const res = await radash.try(this.prisma.user.findUniqueOrThrow)({
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
  async findFirstByEitherUniqueFields(
    email: string,
    username: string
  ): Promise<[Error, UserInfo]> {
    const res = await radash.try(this.prisma.user.findFirstOrThrow)({
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
  async update(
    id: number,
    fields: UpdateableUserFields
  ): Promise<[Error, UserInfo]> {
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
  async create(
    email: string,
    username: string,
    password: string
  ): Promise<[Error, UserInfo]> {
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
  async createWithHash(
    email: string,
    username: string,
    hash: string
  ): Promise<[Error, UserInfo]> {
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
  async delete(id: number): Promise<[Error, UserInfo]> {
    const res = await radash.try(this.prisma.user.delete)({
      where: { id },
      select: USER_FIELDS,
    });
    return res;
  }
}
