export enum AUTH_ERROR {
  INVALID_USER = "User does not exist",
  INVALID_CREDENTIALS = "Invalid credentials",
  UNAVAILABLE_CREDENTIALS = "Credentials already in use",
  UNAVAILABLE_EMAIL = "Email already in use",
  UNAVAILABLE_USERNAME = "Username already in use",
  UNVERIFIED_EMAIL = "User account is not created/verified",
  INVALID_EMAIL_VERIFY_EMAIL_TOKEN = "Email verification token is invalid",
  RESET_EMAIL_ALREADY_SENT = "Password reset email has already been sent",
  UPDATE_ERROR = "Unable to reset password",
}

export const VERIFY_EMAIL_OPTIONS = {
  subject: "Email Verification",
  template: "emailVerification",
};

export enum API_OPERATIONS {
    SIGN_UP_SUMMARY = "Creates a new user with the provided credentials",
    SIGN_IN_SUMMARY = "Successfully signed in and received JWT token cookies",
    SIGN_OUT_SUMMARY = "Signs the user out",
    REFRESH_SUMMARY = "Refresh JWT token cookies",
    VERIFY_SIGN_UP_SUMMARY = "User verifies their email address for sign up",
   
}

export enum API_RESPONSES_DESCRIPTION {
    SUCCESSFUL_SIGNUP_EMAIL_SENT_DESCRIPTION = "Successfully sent a verification email to the email provided",
    SUCCESSFUL_SIGNOUT_DESCRIPTION = "Successfully signed out and cleared JWT token cookies",
    BAD_REQUEST_DESCRIPTION = "Bad Request: Invalid or missing Input",
    UNAUTHORIZED_SIGN_OUT_DESCRIPTION = "Unauthorized Request: User is not logged in",
    REFRESH_DESCRIPTION = "Successfully refreshed JWT tokens",
    SIGN_UP_VERIFY_DESCRIPTION = "Successfully verified email",
 
}
