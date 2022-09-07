import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { CookieOptions } from "express";

export const CSRF_OPTIONS = {
  cookie: true,
  httpOnly: true,
  secure: true,
  sameSite: "lax",
};

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
};

export const CORS_OPTIONS: CorsOptions = {
  origin: [
    // // coinhall.org domains:
    // "https://coinhall.org",
    // /https:\/\/.*\.coinhall\.org/,
    // // vercel deployments:
    // "https://coinhall-org.vercel.app", // main branch
    // /https:\/\/coinhall-[a-z0-9]*-coinhall\.vercel\.app/, // branches
    // localhost regex:
    /http:\/\/localhost:/,
  ],
  credentials: true,
};
