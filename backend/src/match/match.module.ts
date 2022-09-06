import { Module } from "@nestjs/common";

import { UserModule } from "../user/user.module";
import { MatchGateway } from "./match.gateway";

@Module({
  imports: [UserModule],
  providers: [MatchGateway],
})
export class MatchModule {}
