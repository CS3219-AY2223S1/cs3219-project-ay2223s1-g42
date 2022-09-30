import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import * as cookieParser from "cookie-parser";
import { generateOpenApi } from "@ts-rest/open-api";
// import * as path from "path";
// import * as fs from "fs";
// import * as csurf from "csurf";

import { AppModule } from "./app.module";
import { CORS_OPTIONS } from "./config";
import { ApiContract } from "shared/api";

// const HTTPS_OPTIONS = {
//   key: fs.readFileSync(path.join(__dirname, "../ssl/key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "../ssl/cert.pem")),
// };

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // httpsOptions: HTTPS_OPTIONS,
  });
  // const cookieSecret = app.get(ConfigService).getOrThrow("COOKIE_SECRET");
  const port = app.get(ConfigService).get("PORT");

  SwaggerModule.setup(
    "api",
    app,
    generateOpenApi(ApiContract, {
      info: { title: "PeerPrep API", version: "0.1" },
    })
  );

  app.use(cookieParser());
  app.use(helmet());
  // app.use(csurf(CSRF_OPTIONS));
  app.enableCors(CORS_OPTIONS);

  await app.listen(port);
  const url = await app.getUrl();
  console.log("listening on: ", url);
}
bootstrap();
