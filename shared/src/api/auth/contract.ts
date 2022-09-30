import { initContract } from "@ts-rest/core";

import {
  SignupSchema,
  SigninSchema,
  ForgetPasswordSchema,
  ResetPasswordSchema,
  ChangePasswordInfoSchema,
  DeletePasswordSchema,
} from "./schema";

const c = initContract();

const AuthContract = c.router({
  signup: {
    method: "POST",
    path: "/auth/local/signup",
    summary: "Creates a new user with the provided credentials",
    responses: {
      201: c.response<{ message: string }>(),
      400: c.response<{ message: string }>(),
      403: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
    body: SignupSchema,
  },
  signin: {
    method: "POST",
    path: "/auth/local/signin",
    summary: "Successfully signed in and received JWT token cookies",
    responses: {
      200: c.response<{ message: string }>(),
      400: c.response<{ message: string }>(),
      403: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
    body: SigninSchema,
  },
  signout: {
    method: "POST",
    path: "/auth/signout",
    summary: "Signs the user out",
    responses: {
      200: c.response<{ message: string }>(),
      401: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
    body: null,
  },
  refresh: {
    method: "GET",
    path: "/auth/refresh",
    summary: "Refresh JWT token cookies",
    responses: {
      200: c.response<{ message: string }>(),
      401: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
    body: null,
  },
  verify: {
    method: "POST",
    path: "/auth/verify/:token",
    summary: "Verifies that JWT token passed in request is valid",
    responses: {
      200: c.response<{ message: string }>(),
      403: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
    body: null,
  },
  forgetPassword: {
    method: "POST",
    path: "/auth/forget-password",
    summary: "User requests to change existing password",
    responses: {
      201: c.response<{ message: string }>(),
      400: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
    body: ForgetPasswordSchema,
  },
  resetPassword: {
    method: "POST",
    path: "/auth/reset-password",
    summary: "User enters new password to change their existing password",
    responses: {
      200: c.response<{ message: string }>(),
      400: c.response<{ message: string }>(),
      403: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
    body: ResetPasswordSchema,
  },
  changePassword: {
    method: "POST",
    path: "/auth/change-password",
    summary: "Changes password of authenicated users",
    responses: {
      200: c.response<{ message: string }>(),
      400: c.response<{ message: string }>(),
      401: c.response<{ message: string }>(),
      403: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
    body: ChangePasswordInfoSchema,
  },
  deleteAccount: {
    method: "POST",
    path: "/auth/delete-account",
    summary: "Deletes user account after verifying the specified password",
    responses: {
      200: c.response<{ message: string }>(),
      400: c.response<{ message: string }>(),
      401: c.response<{ message: string }>(),
      403: c.response<{ message: string }>(),
      500: c.response<{ message: string }>(),
    },
    body: DeletePasswordSchema,
  },
});

export { AuthContract };
