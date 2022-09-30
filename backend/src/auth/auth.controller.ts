import { Controller, Res, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { Response } from "express";
import { initNestServer, Api, ApiDecorator } from "@ts-rest/nest";

import { AuthService, Tokens } from "./auth.service";
import { JwtRefreshGuard } from "./guard";
import { GetUser, PublicRoute } from "../utils/decorator";
import { COOKIE_OPTIONS } from "../config";
import { AuthContract } from "shared/api";

const authServer = initNestServer(AuthContract);
type AuthControllerShape = typeof authServer.controllerShape;
type AuthRouteShape = typeof authServer.routeShapes;

@Controller()
export class AuthController implements AuthControllerShape {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @Api(authServer.route.signup)
  async signup(@ApiDecorator() { body }: AuthRouteShape["signup"]) {
    await this.authService.signup(body);
    return { status: 200 as const, body: { message: "success" } };
  }

  @PublicRoute()
  @Api(authServer.route.signin)
  async signin(
    @ApiDecorator() { body }: AuthRouteShape["signin"],
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.signin(body);
    this.setCookies(res, tokens);
    return { status: 200 as const, body: { message: "success" } };
  }

  @Api(authServer.route.signout)
  async signout(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.signout(user.id);
    this.clearCookies(res);
    return { status: 200 as const, body: { message: "success" } };
  }

  @PublicRoute()
  @UseGuards(JwtRefreshGuard)
  @Api(authServer.route.refresh)
  async refresh(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.refreshTokens(user.id, user.email);
    this.setCookies(res, tokens);
    return { status: 200 as const, body: { message: "success" } };
  }

  @PublicRoute()
  @Api(authServer.route.verify)
  async verify(
    @ApiDecorator() { params: { token } }: AuthRouteShape["verify"],
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.verifyEmail(token);
    this.setCookies(res, tokens);
    return { status: 200 as const, body: { message: "success" } };
  }

  /**
   * Sends the provided email an link to reset password
   * @param forgetPasswordInfo contains email needed to reset password
   */
  @PublicRoute()
  @Api(authServer.route.forgetPassword)
  async forgetPassword(
    @ApiDecorator() { body }: AuthRouteShape["forgetPassword"]
  ) {
    const { email } = body;
    await this.authService.resetPassword(email);
    return { status: 200 as const, body: { message: "success" } };
  }

  /**
   * Reset password of user that is stored in the specified token
   * @param resetPasswordInfo info of user needed for password reset
   */
  @PublicRoute()
  @Api(authServer.route.resetPassword)
  async resetPassword(
    @ApiDecorator() { body }: AuthRouteShape["resetPassword"]
  ) {
    const { token, password } = body;
    await this.authService.verifyResetEmail(token, password);
    return { status: 200 as const, body: { message: "success" } };
  }

  /**
   * Change password of user after verifying the current password
   * @param changePasswordInfo info of user needed for password change
   */
  @Api(authServer.route.changePassword)
  async changePassword(
    @GetUser() user: User,
    @ApiDecorator() { body }: AuthRouteShape["changePassword"]
  ) {
    const { newPassword, currentPassword } = body;
    await this.authService.changePassword(
      user.id,
      currentPassword,
      newPassword
    );
    return { status: 200 as const, body: { message: "success" } };
  }

  /**
   * Deletes user account after verifying the specified password
   * @param deleteAccountInfo info of user needed for account deletion
   */
  @Api(authServer.route.deleteAccount)
  async deleteAccount(
    @GetUser() user: User,
    @ApiDecorator() { body }: AuthRouteShape["deleteAccount"]
  ) {
    const { password } = body;
    await this.authService.deleteAccount(user.id, password);
    return { status: 200 as const, body: { message: "success" } };
  }

  setCookies(res: Response, tokens: Tokens) {
    res.cookie("refresh_token", tokens.refresh_token, COOKIE_OPTIONS);
    res.cookie("access_token", tokens.access_token, COOKIE_OPTIONS);
  }

  clearCookies(res: Response) {
    res.clearCookie("refresh_token", COOKIE_OPTIONS);
    res.clearCookie("access_token", COOKIE_OPTIONS);
  }
}
