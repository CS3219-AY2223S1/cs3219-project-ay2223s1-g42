export enum AUTH_ERROR {
  INVALID_CREDENTIALS = "Invalid credentials",
  UNAVAILABLE_CREDENTIALS = "Credentials already in use",
  UNAVAILABLE_EMAIL = "Email already in use",
  UNAVAILABLE_USERNAME = "Username already in use",
  UNVERIFIED_EMAIL = "User account is not created/verified",
  INVALID_EMAIL_VERIFY_EMAIL_TOKEN = "Email verification token is invalid",
}

export const VERIFY_EMAIL_OPTIONS = {
  subject: "Email Verification",
  template: "emailVerification",
};
