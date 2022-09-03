import { Injectable } from "@nestjs/common";
import * as radash from "radash";
import * as argon2 from "argon2";

import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

const USER_FIELDS: Prisma.UserSelect = {
  email: true,
  username: true,
  id: true,
};

const USER_HASH_FIELDS: Prisma.UserSelect = {
  ...USER_FIELDS,
  hash: true,
};

@Injectable({})
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
   * @param id id of user to fid
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
   * @param email email of user to fid
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
   * @param username username of user to fid
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
   * Updates the username/email of an existing user in the database
   * @param id id of user to be updated
   * @param newEmail new email of user
   * @param newUsername new username of user
   * @returns [`Err`, `User`]
   */
  async update(id: number, newEmail?: string, newUsername?: string) {
    const res = await radash.try(this.prisma.user.update)({
      where: { id },
      data: {
        username: newUsername,
        email: newEmail,
      },
      select: USER_FIELDS,
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
    });
    return res;
  }
}
