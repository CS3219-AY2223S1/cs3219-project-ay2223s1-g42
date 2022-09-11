import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
} from "@nestjs/common";
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnprocessableEntityResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { User } from "@prisma/client";

import { EditableCredentialsDto } from "../utils/zod";
import { GetUser, PublicRoute } from "../utils/decorator";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Verifies that JWT token passed in request is valid
   * @param user user object obtained from email included in JWT token
   * @returns user object
   */
  @Get("me")
  @ApiOkResponse({ description: "The resource was returned successfully" })
  @ApiForbiddenResponse({ description: "Unauthorized Request" })
  @ApiNotFoundResponse({ description: "Resource not found" })
  getMe(@GetUser() user: User) {
    return user;
  }

  /**
   * Returns info of user with the given id
   * @param id id of user to return information for
   * @returns user object of the user with the given id
   */
  @PublicRoute()
  @Get(":id")
  @ApiOkResponse({ description: "The resource was returned successfully" })
  @ApiForbiddenResponse({ description: "Unauthorized Request" })
  @ApiNotFoundResponse({ description: "Resource not found" })
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
  @Patch(":id")
  @ApiOperation({ summary: "Edit data of specified user" })
  @ApiOkResponse({ description: "The resource was updated successfully" })
  @ApiNotFoundResponse({ description: "Resource not found" })
  @ApiForbiddenResponse({ description: "Unauthorized Request" })
  @ApiUnprocessableEntityResponse({ description: "Bad Request" })
  async editUser(
    @GetUser() user: User,
    @Param("id") id: string,
    @Body() userInfo: EditableCredentialsDto
  ) {
    if (parseInt(id) === user.id) {
      const { email, username } = userInfo;
      const [err, newUser] = await this.userService.update(user.id, {
        email,
        username,
      });
      if (err) {
        throw err;
      }
      return newUser;
    }
    throw new BadRequestException("Failed to update user.");
  }

  /**
   * Deletes the user with the given id from the database
   * @param user user object obtained from email included in JWT token
   * @param id id of user to be deleted
   * @returns deleted user object
   */
  @Delete(":id")
  @ApiOperation({ summary: "Delete data of specified user" })
  @ApiOkResponse({ description: "The resource was returned successfully" })
  @ApiForbiddenResponse({ description: "Unauthorized Request" })
  @ApiNotFoundResponse({ description: "Resource not found" })
  async deleteUser(@GetUser() user: User, @Param("id") id: string) {
    if (parseInt(id) === user.id) {
      const [err, deletedUser] = await this.userService.delete(user.id);
      if (err) {
        throw err;
      }
      return deletedUser;
    }
    throw new BadRequestException("Failed to delete user.");
  }
}
