import { AppModule } from "src/app.module";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

const userApiDocsConfig = new DocumentBuilder()
  .setTitle("User API Routes")
  .setDescription("API routes for users")
  .build();

const swaggerConfig = new DocumentBuilder()
  .setTitle("G42 PeerPrep API")
  .setDescription("The REST interface for querying the G42 PeerPrep API")
  .setVersion("1.0")
  .addTag("User API Routes")
  .addTag("Auth API Routes")
  .addTag("Question API Routes")
  .build();

export { userApiDocsConfig, swaggerConfig };
