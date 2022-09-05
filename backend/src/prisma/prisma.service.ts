import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    const url = config.getOrThrow("DATABASE_URL");
    super({
      datasources: {
        db: {
          url,
        },
      },
    });
  }
}
