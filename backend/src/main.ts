import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import * as cookieParser from "cookie-parser";
// import * as path from "path";
// import * as fs from "fs";
/* import * as csurf from "csurf"; */

import { AppModule } from "./app.module";
import { CORS_OPTIONS, CSRF_OPTIONS } from "./config";
import { patchNestjsSwagger } from "@anatine/zod-nestjs";

// const HTTPS_OPTIONS = {
//   key: fs.readFileSync(path.join(__dirname, "../../../ssl/key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "../../../ssl/cert.pem")),
//   ca: fs.readFileSync(path.join(__dirname, "../../../ssl/ca.pem")),
// };

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // httpsOptions: HTTPS_OPTIONS,
  });

  const port = app.get(ConfigService).get("PORT");

  const swaggerConfig = new DocumentBuilder()
    .setTitle("G42 PeerPrep API")
    .setDescription("The REST interface for querying the G42 PeerPrep API")
    .addTag("User API routes")
    .addTag("Auth API routes")
    .addTag("Question API routes")
    .addTag("Attempt API routes")
    .setVersion("1.0")
    .build();

  patchNestjsSwagger();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  app.use(cookieParser());
  app.use(helmet());
  /* app.use(csurf(CSRF_OPTIONS)); */
  app.enableCors(CORS_OPTIONS);

  await app.listen(port);
  const url = await app.getUrl();
  console.log("listening on: ", url);
}
bootstrap();
