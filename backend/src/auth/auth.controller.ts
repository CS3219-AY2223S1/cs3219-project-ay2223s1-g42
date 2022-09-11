import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { Response } from "express";

import { AuthService, Tokens } from "./auth.service";
import {
  SigninCredentialsDto,
  SignupCredentialsDto,
  ForgetPasswordCredentialsDto,
  ResetPasswordCredentialsDto,
} from "../utils/zod";
import { JwtRefreshGuard } from "./guard";
import { GetUser, PublicRoute } from "../utils/decorator";
import { COOKIE_OPTIONS } from "../config";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @Post("/local/signup")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Creates a new user with the provided credentials" })
  @ApiOkResponse({
    description: "Successfully sent a verification email to the email provided",
  })
  async signup(@Body() credentials: SignupCredentialsDto) {
    await this.authService.signup(credentials);
    return { message: "success" };
  }

  @PublicRoute()
  @Post("/local/signin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Signs the user in" })
  @ApiOkResponse({
    description: "Successfully signed in and received JWT token cookies",
  })
  async signin(
    @Body() credentials: SigninCredentialsDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.signin(credentials);
    this.setCookies(res, tokens);
    return { message: "success" };
  }

  @Post("/signout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Signs the user out" })
  @ApiOkResponse({
    description: "Successfully signed out and cleared JWT token cookies",
  })
  async signout(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.signout(user.id);
    this.clearCookies(res);
    return { message: "success" };
  }

  @PublicRoute()
  @UseGuards(JwtRefreshGuard)
  @Post("/refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh JWT token cookies" })
  @ApiOkResponse({
    description: "Successfully refreshed JWT tokens",
  })
  async refresh(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.refreshTokens(user.id, user.email);
    this.setCookies(res, tokens);
    return { message: "success" };
  }

  @PublicRoute()
  @Post("/verify/:token")
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Param("token") token: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.verifyEmail(token);
    this.setCookies(res, tokens);
    return { message: "success" };
  }

  setCookies(res: Response, tokens: Tokens) {
    res.cookie("refresh_token", tokens.refresh_token, COOKIE_OPTIONS);
    res.cookie("access_token", tokens.access_token, COOKIE_OPTIONS);
  }

  clearCookies(res: Response) {
    res.clearCookie("refresh_token", COOKIE_OPTIONS);
    res.clearCookie("access_token", COOKIE_OPTIONS);
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
    await this.authService.resetPassword(email);
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
    await this.authService.verifyResetEmail(token, password);
    return { message: "success" };
  }
}
