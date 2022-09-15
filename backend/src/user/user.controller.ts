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
<<<<<<< HEAD
  @ApiUnauthorizedResponse({ description: "Unauthorized Request: User is not logged in" })
=======
  @ApiUnauthorizedResponse({
    description: "Unauthorized Request: User is not logged in",
  })
>>>>>>> fb5dc7ed9d67f6c5e64e96f4f69f1781c9682796
  @ApiNotFoundResponse({ description: "Not Found: Resource not found" })
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
<<<<<<< HEAD
  @ApiUnauthorizedResponse({ description: "Unauthorized Request: Client provided no credentials or invalid credentials" })
  @ApiForbiddenResponse({ description: "Unauthorized Request: Client does not have access rights to the requested content" })
=======
  @ApiUnauthorizedResponse({
    description:
      "Unauthorized Request: Client provided no credentials or invalid credentials",
  })
  @ApiForbiddenResponse({
    description:
      "Unauthorized Request: Client does not have access rights to the requested content",
  })
>>>>>>> fb5dc7ed9d67f6c5e64e96f4f69f1781c9682796
  @ApiNotFoundResponse({ description: "Not Found: Resource not found" })
  async getUser(@Param("id") id: string) {
    const [err, user] = await this.userService.find({ id: parseInt(id) });
    if (err instanceof Prisma.NotFoundError) {
<<<<<<< HEAD
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
=======
      throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
>>>>>>> fb5dc7ed9d67f6c5e64e96f4f69f1781c9682796
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
  @ApiNotFoundResponse({ description: "Not Found: Resource not found" })
<<<<<<< HEAD
  @ApiUnauthorizedResponse({ description: "Unauthorized Request: Client provided no credentials or invalid credentials" })
  @ApiForbiddenResponse({ description: "Unauthorized Request: Client does not have access rights to the requested content" })
  @ApiUnprocessableEntityResponse({ description: "Bad Request: Unable to process instruction" })
  @ApiBadRequestResponse({description: "Bad Request: ID specified is invalid"})

=======
  @ApiUnauthorizedResponse({
    description:
      "Unauthorized Request: Client provided no credentials or invalid credentials",
  })
  @ApiForbiddenResponse({
    description:
      "Unauthorized Request: Client does not have access rights to the requested content",
  })
  @ApiUnprocessableEntityResponse({
    description: "Bad Request: Unable to process instruction",
  })
  @ApiBadRequestResponse({
    description: "Bad Request: ID specified is invalid",
  })
>>>>>>> fb5dc7ed9d67f6c5e64e96f4f69f1781c9682796
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
<<<<<<< HEAD
        throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
      } else if (err instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
=======
        throw new HttpException("Resource not found", HttpStatus.NOT_FOUND);
      } else if (err instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
>>>>>>> fb5dc7ed9d67f6c5e64e96f4f69f1781c9682796
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
<<<<<<< HEAD
  @ApiForbiddenResponse({ description: "Unauthorized Request: Client does not have access rights to the requested content" })
  @ApiNotFoundResponse({ description: "Not Found: Resource not found" })
  @ApiBadRequestResponse({description: "Bad Request: id specified is invalid"})
=======
  @ApiForbiddenResponse({
    description:
      "Unauthorized Request: Client does not have access rights to the requested content",
  })
  @ApiNotFoundResponse({ description: "Not Found: Resource not found" })
  @ApiBadRequestResponse({
    description: "Bad Request: id specified is invalid",
  })
>>>>>>> fb5dc7ed9d67f6c5e64e96f4f69f1781c9682796
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
