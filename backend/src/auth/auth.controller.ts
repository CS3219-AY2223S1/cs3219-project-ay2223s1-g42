import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { Response } from "express";

import { AuthService, Tokens } from "./auth.service";
import { SigninCredentialsDto, SignupCredentialsDto } from "../utils/zod";
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
  async signup(
    @Body() credentials: SignupCredentialsDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.signup(credentials);
    this.setCookies(res, tokens);
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

  setCookies(res: Response, tokens: Tokens) {
    res.cookie("refresh_token", tokens.refresh_token, COOKIE_OPTIONS);
    res.cookie("access_token", tokens.access_token, COOKIE_OPTIONS);
  }

  clearCookies(res: Response) {
    res.clearCookie("refresh_token", COOKIE_OPTIONS);
    res.clearCookie("access_token", COOKIE_OPTIONS);
  }
}
