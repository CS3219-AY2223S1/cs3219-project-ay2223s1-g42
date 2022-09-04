import { CookieOptions } from "express";

export enum AUTH_ERROR {
  INVALID_CREDENTIALS = "Invalid credentials",
  UNAVAILABLE_CREDENTIALS = "Credentials already in use",
}

export const COOKIE_OPTIONS: CookieOptions = {
  secure: false,
  httpOnly: false,
  sameSite: "none",
};
