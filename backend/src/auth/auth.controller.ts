import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
} from "@nestjs/swagger";
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
import { API_OPERATIONS, API_RESPONSES_DESCRIPTION } from "../utils/constants";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @Post("/local/signup")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: API_OPERATIONS.SIGN_UP_SUMMARY })
  @ApiCreatedResponse({
    description:
      API_RESPONSES_DESCRIPTION.SUCCESSFUL_SIGNUP_EMAIL_SENT_DESCRIPTION,
  })
  @ApiCreatedResponse({
    description:
      API_RESPONSES_DESCRIPTION.SUCCESSFUL_SIGNUP_EMAIL_SENT_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description: API_RESPONSES_DESCRIPTION.BAD_REQUEST_DESCRIPTION,
  })
  @ApiForbiddenResponse({
    description: API_RESPONSES_DESCRIPTION.FORBIDDEN_SIGNUP_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  async signup(@Body() credentials: SignupCredentialsDto) {
    await this.authService.signup(credentials);
    return { message: "success" };
  }

  @PublicRoute()
  @Post("/local/signin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: API_OPERATIONS.SIGN_IN_SUMMARY })
  @ApiOkResponse({
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_SIGNIN_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description: API_RESPONSES_DESCRIPTION.BAD_REQUEST_DESCRIPTION,
  })
  @ApiForbiddenResponse({
    description: API_RESPONSES_DESCRIPTION.FORBIDDEN_SIGNIN_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
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
  @ApiOperation({ summary: API_OPERATIONS.SIGN_OUT_SUMMARY })
  @ApiOkResponse({
    description: API_RESPONSES_DESCRIPTION.SUCCESSFUL_SIGNOUT_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description: API_RESPONSES_DESCRIPTION.UNAUTHORIZED_SIGN_OUT_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
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
  @Get("/refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: API_OPERATIONS.REFRESH_SUMMARY })
  @ApiOkResponse({
    description: API_RESPONSES_DESCRIPTION.REFRESH_DESCRIPTION,
  })
  @ApiUnauthorizedResponse({
    description: API_RESPONSES_DESCRIPTION.UNAUTHORIZED_ACCESS_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
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
  @ApiOperation({ summary: API_OPERATIONS.VERIFY_SIGN_UP_SUMMARY })
  @ApiOkResponse({
    description:
      API_RESPONSES_DESCRIPTION.SUCCESSFUL_SIGN_UP_VERIFY_DESCRIPTION,
  })
  @ApiForbiddenResponse({
    description: API_RESPONSES_DESCRIPTION.FORBIDDEN_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
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
  @ApiOperation({ summary: API_OPERATIONS.FORGET_PASSWORD_SUMMARY })
  @ApiOkResponse({
    description:
      API_RESPONSES_DESCRIPTION.SUCCESSFUL_FORGETPASSWORD_EMAIL_SENT_DESCRIPTION,
  })
  @ApiCreatedResponse({
    description:
      API_RESPONSES_DESCRIPTION.SUCCESSFUL_FORGETPASSWORD_EMAIL_SENT_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description:
      API_RESPONSES_DESCRIPTION.BAD_REQUEST_INVALID_CREDENTIALS_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
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
  @ApiOperation({ summary: API_OPERATIONS.RESET_PASSWORD_SUMMARY })
  @ApiOkResponse({
    description:
      API_RESPONSES_DESCRIPTION.SUCCESSFUL_RESET_PASSWORD_DESCRIPTION,
  })
  @ApiForbiddenResponse({
    description:
      API_RESPONSES_DESCRIPTION.BAD_REQUEST_INVALID_TOKEN_DESCRIPTION,
  })
  @ApiBadRequestResponse({
    description:
      API_RESPONSES_DESCRIPTION.BAD_REQUEST_INVALID_CREDENTIALS_DESCRIPTION,
  })
  @ApiInternalServerErrorResponse({
    description: API_RESPONSES_DESCRIPTION.INTERNAL_SERVER_ERROR,
  })
  async resetPassword(@Body() resetPasswordInfo: ResetPasswordCredentialsDto) {
    const { token, password } = resetPasswordInfo;
    await this.authService.verifyResetEmail(token, password);
    return { message: "success" };
  }
}
