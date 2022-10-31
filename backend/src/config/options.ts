import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { CookieOptions } from "express";

const CSRF_OPTIONS = {
  cookie: true,
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

const CORS_OPTIONS: CorsOptions = {
  allowedHeaders: ["content-type"],
  credentials: true,
  origin: [
    // xyz domain
    "https://cs3219-g42-peerprep.xyz",
    // vercel deployments:
    /https:\/\/.*\.vercel\.app/,
    // localhost regex:
    /http:\/\/localhost:/,
  ],
};

export { CSRF_OPTIONS, COOKIE_OPTIONS, CORS_OPTIONS };
