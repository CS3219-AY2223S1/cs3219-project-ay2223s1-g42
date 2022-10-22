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
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from "@nestjs/swagger";
import { User } from "@prisma/client";

import {
  DeleteUserResponse,
  EditUserResponse,
  GetUserResponse,
  UserInfo,
} from "shared/api";
import { GetUser, PublicRoute } from "../utils/decorator";
import { UserService } from "./user.service";
import { API_OPERATIONS, API_RESPONSES_DESCRIPTION } from "../utils/constants";
import { ThrowKnownPrismaErrors } from "src/utils";
import { EditableCredentialsDto } from "src/auth/auth.dto";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Verifies that JWT token passed in request is valid
   * @param user user object obtained from email included in JWT token
   * @returns user object
   */
  @Get("me")
  @ApiTags("User API routes")
  @ApiOperation({ summary: API_OPERATIONS.JWT_VERIFICATION_TOKEN_SUMMARY })
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
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  getMe(@GetUser() user: UserInfo): GetUserResponse {
    return user;
  }

  /**
   * Returns info of user with the given id
   * @param id id of user to return information for
   * @returns user object of the user with the given id
   */
  @PublicRoute()
  @Get(":id")
  @ApiTags("User API routes")
  @ApiOperation({ summary: API_OPERATIONS.RETURN_USER_INFO_WITH_ID_SUMMARY })
  @ApiOkResponse({
    description:
      API_RESPONSES_DESCRIPTION.SUCCESSFUL_RETRIEVAL_OF_USER_INFORMATION_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description: API_RESPONSES_DESCRIPTION.BAD_REQUEST_INVALID_ID_DESCRIPTION,
  })
  @ApiForbiddenResponse({
    description: API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiNotFoundResponse({
    description: API_RESPONSES_DESCRIPTION.NOT_FOUND_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  async getUser(@Param("id") id: string): Promise<GetUserResponse> {
    const [err, user] = await this.userService.find({ id: parseInt(id) });
    ThrowKnownPrismaErrors(err);
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
  @ApiTags("User API routes")
  @ApiOperation({ summary: API_OPERATIONS.EDIT_USER_INFO_SUMMARY })
  @ApiOkResponse({
    description:
      API_RESPONSES_DESCRIPTION.SUCCESSFUL_UPDATE_USER_INFORMATION_DESCRIPTION,
  })
  @ApiNotFoundResponse({
    description: API_RESPONSES_DESCRIPTION.NOT_FOUND_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description: API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiForbiddenResponse({
    description: API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiUnprocessableEntityResponse({
    description:
      API_RESPONSES_DESCRIPTION.UNABLE_TO_PROCESS_INSTRUCTION_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description:
      API_RESPONSES_DESCRIPTION.BAD_REQUEST_INVALID_CREDENTIALS_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  async editUser(
    @GetUser() user: User,
    @Param("id") id: string,
    @Body() userInfo: EditableCredentialsDto
  ): Promise<EditUserResponse> {
    if (parseInt(id) === user.id) {
      const { email, username } = userInfo;
      const [err] = await this.userService.update(user.id, {
        email,
        username,
      });
      ThrowKnownPrismaErrors(err);
      return { message: "success" };
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
  @ApiTags("User API routes")
  @ApiOperation({ summary: API_OPERATIONS.DELETE_USER_SUMMARY })
  @ApiOkResponse({
    description:
      API_RESPONSES_DESCRIPTION.SUCCESSFUL_UPDATE_USER_INFORMATION_DESCRIPTION,
  })
  @ApiForbiddenResponse({
    description: API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiNotFoundResponse({
    description: API_RESPONSES_DESCRIPTION.NOT_FOUND_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description: API_RESPONSES_DESCRIPTION.BAD_REQUEST_INVALID_ID_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  async deleteUser(
    @GetUser() user: User,
    @Param("id") id: string
  ): Promise<DeleteUserResponse> {
    if (parseInt(id) === user.id) {
      const [err, deletedUser] = await this.userService.delete(user.id);
      ThrowKnownPrismaErrors(err);
      return deletedUser;
    }
    throw new BadRequestException("Failed to delete user.");
  }
}
