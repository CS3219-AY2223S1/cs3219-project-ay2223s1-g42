import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import * as csurf from "csurf";
import * as cookieParser from "cookie-parser";

import { AppModule } from "./app.module";
import { CORS_OPTIONS, CSRF_OPTIONS } from "./config/constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const cookieSecret = app.get(ConfigService).getOrThrow("COOKIE_SECRET");
  const port = app.get(ConfigService).get("PORT");

  app.use(cookieParser());
  app.use(helmet());
  // app.use(csurf(CSRF_OPTIONS));
  app.enableCors(CORS_OPTIONS);

  await app.listen(port);
  const url = await app.getUrl();
  console.log("listening on: ", url);
}
bootstrap();
