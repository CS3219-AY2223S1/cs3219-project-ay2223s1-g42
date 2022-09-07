import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Socket } from "socket.io";
import * as jwt from "jsonwebtoken";

import { JwtPayload } from "../auth.service";
import { UserService } from "../../user/user.service";
import { access } from "fs";
import { Observable } from "rxjs";

@Injectable()
export class WsJwtAccessGuard extends AuthGuard("jwt-ws") {
  constructor(
    private config: ConfigService,
    private reflector: Reflector,
    private users: UserService
  ) {
    super();
  }

  getRequest(context: ExecutionContext) {
    let accessToken = "";
    const secret = this.config.getOrThrow("JWT_SECRET");
    const client: Socket = context.switchToWs().getClient();
    if (client.handshake.headers.cookie) {
      const cookies = client.handshake.headers.cookie.split(";");
      const dirtyAccessToken = cookies.find((c) =>
        c.trim().startsWith("access_token=")
      );
      if (dirtyAccessToken) {
        const cleanedAccessToken = dirtyAccessToken.split("=")[1];
        accessToken = cleanedAccessToken;
      }
    }
    return {
      headers: {
        authorization: accessToken,
      },
    };
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride("isPublicRoute", [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
