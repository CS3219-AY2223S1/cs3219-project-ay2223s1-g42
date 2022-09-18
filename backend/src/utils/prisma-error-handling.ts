import { Prisma } from "@prisma/client";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime";
import { HttpException, HttpStatus } from "@nestjs/common";

export default function PrismaKnownErrorHandling(e: Error) {
  if (
    e instanceof PrismaClientUnknownRequestError ||
    e instanceof PrismaClientRustPanicError ||
    e instanceof PrismaClientInitializationError
  ) {
    //Unknown errors
    throw new HttpException(
      "Internal Server Error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  } else if (e instanceof PrismaClientValidationError) {
    throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
  } else if (e instanceof Prisma.NotFoundError) {
    throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
  }
}
