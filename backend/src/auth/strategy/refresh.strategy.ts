import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";

import { UserService } from "../../user/user.service";
import { JwtPayload } from "../auth.service";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh"
) {
  constructor(config: ConfigService, private users: UserService) {
    const secret = config.getOrThrow("JWT_REFRESH_SECRET");
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req && req.cookies) {
            return req.cookies["refresh_token"];
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const [err, user] = await this.users.find({
      id: payload.sub,
    });
    if (err) {
      throw err;
    }
    if (!user) {
      return null;
    }
    return user;
  }
}
