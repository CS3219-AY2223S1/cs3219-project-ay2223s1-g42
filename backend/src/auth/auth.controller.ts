import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { CredentialsDto } from "../zod";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  signup(@Body() credentials: CredentialsDto) {
    return this.authService.signup(credentials);
  }

  @HttpCode(HttpStatus.OK)
  @Post("signin")
  signin(@Body() credentials: CredentialsDto) {
    return this.authService.signin(credentials);
  }
}
