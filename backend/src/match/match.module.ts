import { Module } from "@nestjs/common";

import { MatchGateway } from "./match.gateway";
import { MatchServiceModule } from "./match.service.module";

@Module({
  imports: [MatchServiceModule],
  providers: [MatchGateway],
})
export class MatchModule {}
