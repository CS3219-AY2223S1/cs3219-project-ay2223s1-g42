import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const cookieSecret = app.get(ConfigService).getOrThrow("COOKIE_SECRET");
  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });
  const port = app.get(ConfigService).get("PORT");
  await app.listen(port);
}
bootstrap();
