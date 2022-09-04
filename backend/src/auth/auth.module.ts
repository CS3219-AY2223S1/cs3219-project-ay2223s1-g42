import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AccessJwtStrategy, RefreshJwtStrategy } from "./strategy";

@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [AuthService, AccessJwtStrategy, RefreshJwtStrategy],
})
export class AuthModule {}
