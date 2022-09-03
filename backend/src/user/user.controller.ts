import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { User } from "@prisma/client";

import { UserInfoDto } from "../zod";
import { GetUser } from "../auth/decorator/get-user.decorator";
import { JwtGuard } from "../auth/guard";
import { UserService } from "./user.service";

@UseGuards(JwtGuard)
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Verifies that JWT token passed in request is valid
   * @param user user object obtained from email included in JWT token
   * @returns user object
   */
  @Get("me")
  getMe(@GetUser() user: User) {
    return user;
  }

  /**
   * Returns info of user with the given id
   * @param id id of user to return information for
   * @returns user object of the user with the given id
   */
  @Get(":id")
  async getUser(@Param("id") id: string) {
    const [err, user] = await this.userService.find({ id: parseInt(id) });

    if (err) {
      throw err;
    }

    return user;
  }

  /**
   * Updates the user with the new information provided
   * @param user user object obtained from email included in JWT token
   * @param id id of user to be edited
   * @param userInfo info of user to be edited
   * @returns user object of the edited user
   */
  @Put(":id")
  async editUser(
    @GetUser() user: User,
    @Param("id") id: string,
    @Body() userInfo: UserInfoDto
  ) {
    if (parseInt(id) === user.id) {
      const [err, newUser] = await this.userService.update(
        user.id,
        userInfo.email,
        userInfo.username
      );

      if (err) {
        throw err;
      }

      return newUser;
    }

    throw new ForbiddenException("Failed to update user.");
  }

  /**
   * Deletes the user with the given id from the database
   * @param user user object obtained from email included in JWT token
   * @param id id of user to be deleted
   * @returns deleted user object
   */
  @Delete(":id")
  async deleteUser(@GetUser() user: User, @Param("id") id: string) {
    if (parseInt(id) === user.id) {
      const [err, deletedUser] = await this.userService.delete(user.id);

      if (err) {
        throw err;
      }

      return deletedUser;
    }

    throw new ForbiddenException("Failed to delete user.");
  }
}
