import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { CredentialsDto } from "../../prisma/zod";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  signup(@Body() credentials: CredentialsDto) {
    console.log(credentials);
    return this.authService.signup();
  }

  @Post("signin")
  signin() {
    return this.authService.signin();
  }
}
