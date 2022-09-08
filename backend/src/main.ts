import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as fs from "fs";
import * as csurf from "csurf";

import { AppModule } from "./app.module";
import { CORS_OPTIONS } from "./config";

const HTTPS_OPTIONS = {
  key: fs.readFileSync(path.join(__dirname, "../ssl/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../ssl/cert.pem")),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // httpsOptions: HTTPS_OPTIONS,
  });
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
