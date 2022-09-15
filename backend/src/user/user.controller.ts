import {
  BadRequestException,
  HttpException,
  HttpStatus,
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
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import { Prisma, User } from "@prisma/client";

import { EditableCredentialsDto } from "../utils/zod";
import { GetUser, PublicRoute } from "../utils/decorator";
import { UserService } from "./user.service";
import { API_OPERATIONS, API_RESPONSES_DESCRIPTION } from "../utils/constants";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Verifies that JWT token passed in request is valid
   * @param user user object obtained from email included in JWT token
   * @returns user object
   */
  @Get("me")
  @ApiOperation({ summary: API_OPERATIONS.JWTVerificationTokenSummary })
  @ApiOkResponse({
    description:
      API_RESPONSES_DESCRIPTION.SUCCESSFUL_RETRIEVAL_OF_USER_INFORMATION_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description:
      API_RESPONSES_DESCRIPTION.UNAUTHORIZED_REQUEST_USER_NOT_LOGGED_IN_DESCRIPTION,
  })
  @ApiNotFoundResponse({
    description: API_RESPONSES_DESCRIPTION.NOT_FOUND_DESCRIPTION,
  })
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
  @ApiOperation({ summary: API_OPERATIONS.RETURN_USER_INFO_WITH_ID_SUMMARY })
  @ApiOkResponse({
    description:
      API_RESPONSES_DESCRIPTION.SUCCESSFUL_RETRIEVAL_OF_USER_INFORMATION_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description:
      API_RESPONSES_DESCRIPTION.BAD_REQUEST_INVALID_CREDENTIALS_DESCRIPTION,
  })
  @ApiForbiddenResponse({
    description: API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiNotFoundResponse({
    description: API_RESPONSES_DESCRIPTION.NOT_FOUND_DESCRIPTION,
  })
  async getUser(@Param("id") id: string) {
    const [err, user] = await this.userService.find({ id: parseInt(id) });
    if (err instanceof Prisma.NotFoundError) {
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
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
  @ApiOperation({ summary: API_OPERATIONS.EDIT_USER_INFO_SUMMARY })
  @ApiOkResponse({
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_UPDATE_USER_INFORMATION_DESCRIPTION 
  })
  @ApiNotFoundResponse({ description: API_RESPONSES_DESCRIPTION.NOT_FOUND_DESCRIPTION })
  @ApiUnauthorizedResponse({
    description:
    API_RESPONSES_DESCRIPTION.BAD_REQUEST_INVALID_CREDENTIALS_DESCRIPTION,
  })
  @ApiForbiddenResponse({
    description:
      API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiUnprocessableEntityResponse({
    description: API_RESPONSES_DESCRIPTION.UNABLE_TO_PROCESS_INSTRUCTION_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description: API_RESPONSES_DESCRIPTION.BAD_REQUEST_INVALID_CREDENTIALS_DESCRIPTION,
  })
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
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException("Resource not found", HttpStatus.NOT_FOUND);
      } else if (err instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
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
  @ApiOperation({ summary: API_OPERATIONS.DELETE_USER_SUMMARY })
  @ApiOkResponse({ 
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_UPDATE_USER_INFORMATION_DESCRIPTION 
  })
  @ApiForbiddenResponse({
    description:
    API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiNotFoundResponse({ description: API_RESPONSES_DESCRIPTION.NOT_FOUND_DESCRIPTION })
  @ApiBadRequestResponse({
    description: API_RESPONSES_DESCRIPTION.BAD_REQUEST_INVALID_CREDENTIALS_DESCRIPTION,
  })
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
