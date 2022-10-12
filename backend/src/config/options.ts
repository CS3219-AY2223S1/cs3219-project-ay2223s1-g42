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
  secure: true,
  sameSite: "none",
};

const CORS_OPTIONS: CorsOptions = {
  origin: [
    // // coinhall.org domains:
    // "https://coinhall.org",
    // /https:\/\/.*\.coinhall\.org/,
    // vercel deployments:
    "https://cs3219-project-ay2223s1-g42.vercel.app", // jk's link
    "https://cs3219-g42.vercel.app", // aidan's link
    "https://cs3219-g42-aidanaden.vercel.app", // aidan's link
    "https://cs3219-g42-peerprep.xyz", // xyz domain
    // vercel deployments:
    /https:\/\/*\.vercel\.app/, // branches
    /https:\/\/cs3219-g42-[a-z0-9]*-aidanaden\.vercel\.app/, // branches
    // localhost regex:
    /http:\/\/localhost:/,
  ],
  credentials: true,
  allowedHeaders: ["content-type"],
};

export { CSRF_OPTIONS, COOKIE_OPTIONS, CORS_OPTIONS };
