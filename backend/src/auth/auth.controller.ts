import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { CredentialsDto } from "../zod";
import { JwtRefreshGuard } from "./guard";
import { GetUser, PublicRoute } from "./decorator";
import { User } from "@prisma/client";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @Post("/local/signup")
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() credentials: CredentialsDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.signup(credentials);
    res.cookie("refresh_token", tokens.refresh_token);
    res.cookie("access_token", tokens.access_token);
    return { message: "success" };
  }

  @PublicRoute()
  @Post("/local/signin")
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() credentials: CredentialsDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.signin(credentials);
    res.cookie("refresh_token", tokens.refresh_token);
    res.cookie("access_token", tokens.access_token);
    return { message: "success" };
  }

  @Post("/signout")
  @HttpCode(HttpStatus.OK)
  async signout(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.signout(user.id);
    res.clearCookie("refresh_token");
    res.clearCookie("access_token");
    return { message: "success" };
  }

  @PublicRoute()
  @UseGuards(JwtRefreshGuard)
  @Post("/refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.refreshTokens(user.id, user.email);
    res.cookie("refresh_token", tokens.refresh_token);
    res.cookie("access_token", tokens.access_token);
    return { message: "success" };
  }
}
