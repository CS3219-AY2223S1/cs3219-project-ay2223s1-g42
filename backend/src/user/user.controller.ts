import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Param,
  Patch,
} from "@nestjs/common";
import { User } from "@prisma/client";

import {
  EditableCredentialsDto,
  ForgetPasswordCredentialsDto,
  ResetPasswordCredentialsDto,
} from "../utils/zod";
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

  /**
   * Sends the provided email an link to reset password
   * @param forgetPasswordInfo contains email needed to reset password
   */
  @PublicRoute()
  @Post("/forget-password")
  @HttpCode(HttpStatus.CREATED)
  async forgetPassword(
    @Body() forgetPasswordInfo: ForgetPasswordCredentialsDto
  ) {
    const { email } = forgetPasswordInfo;
    await this.userService.resetPassword(email);
    return { message: "success" };
  }

  /**
   * Reset password of user that is stored in the specified token
   * @param resetPasswordInfo info of user needed for password reset
   */
  @PublicRoute()
  @Post("/reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordInfo: ResetPasswordCredentialsDto) {
    const { token, password } = resetPasswordInfo;
    await this.userService.verifyResetEmail(token, password);
    return { message: "success" };
  }
}
