import { BadRequestException, Controller } from "@nestjs/common";
import { User } from "@prisma/client";
import { Api, ApiDecorator, initNestServer } from "@ts-rest/nest";

import { GetUser, PublicRoute } from "../utils/decorator";
import { UserService } from "./user.service";
import ThrowKnownPrismaErrors from "../utils/ThrowKnownPrismaErrors";
import { UserContract, UserInfo } from "shared/api";

const userServer = initNestServer(UserContract);
type UserControllerShape = typeof userServer.controllerShape;
type UserRouteShape = typeof userServer.routeShapes;

@Controller()
export class UserController implements UserControllerShape {
  constructor(private userService: UserService) {}

  /**
   * Verifies that JWT token passed in request is valid
   * @param user user object obtained from email included in JWT token
   * @returns user object
   */
  @Api(userServer.route.me)
  async me(@GetUser() user: User) {
    if (!user) {
      return { status: 401 as const, body: { message: "Unauthorized" } };
    }
    return { status: 201 as const, body: user };
  }

  /**
   * Returns info of user with the given id
   * @param id id of user to return information for
   * @returns user object of the user with the given id
   */
  @PublicRoute()
  @Api(userServer.route.getUser)
  async getUser(@ApiDecorator() { params: { id } }: UserRouteShape["getUser"]) {
    const [err, user] = await this.userService.find({ id: parseInt(id) });
    ThrowKnownPrismaErrors(err);
    return { status: 200 as const, body: user as UserInfo };
  }

  /**
   * Updates the user with the new information provided
   * @param user user object obtained from email included in JWT token
   * @param id id of user to be edited
   * @param userInfo info of user to be edited
   * @returns user object of the edited user
   */
  @Api(userServer.route.editUser)
  async editUser(
    @GetUser() user: User,
    @ApiDecorator() { params: { id }, body }: UserRouteShape["editUser"]
  ) {
    if (parseInt(id) === user.id) {
      const { email, username } = body;
      const [err] = await this.userService.update(user.id, {
        email,
        username,
      });
      ThrowKnownPrismaErrors(err);
      return { status: 200 as const, body: { message: "success" } };
    }
    throw new BadRequestException("Failed to update user.");
  }

  /**
   * Deletes the user with the given id from the database
   * @param user user object obtained from email included in JWT token
   * @param id id of user to be deleted
   * @returns deleted user object
   */
  @Api(userServer.route.deleteUser)
  async deleteUser(
    @GetUser() user: User,
    @ApiDecorator() { params: { id } }: UserRouteShape["deleteUser"]
  ) {
    if (parseInt(id) === user.id) {
      const [err, deletedUser] = await this.userService.delete(user.id);
      ThrowKnownPrismaErrors(err);
      return { status: 200 as const, body: deletedUser as UserInfo };
    }
    throw new BadRequestException("Failed to delete user.");
  }
}
