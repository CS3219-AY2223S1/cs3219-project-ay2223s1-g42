import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { CookieOptions } from "express";

const CSRF_OPTIONS = {
  cookie: true,
  httpOnly: true,
  secure: false,
  sameSite: "lax",
};

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
};

const CORS_OPTIONS: CorsOptions = {
  origin: [
    // // coinhall.org domains:
    // "https://coinhall.org",
    // /https:\/\/.*\.coinhall\.org/,
    // vercel deployments:
    "https://cs3219-g42-aidanaden.vercel.app", // main branch
    /https:\/\/cs3219-g42-[a-z0-9]*-aidanaden\.vercel\.app/, // branches
    // localhost regex:
    /http:\/\/localhost:/,
  ],
  credentials: true,
};

export { CSRF_OPTIONS, COOKIE_OPTIONS, CORS_OPTIONS };
