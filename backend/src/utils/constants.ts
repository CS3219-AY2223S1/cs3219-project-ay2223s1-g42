export enum AUTH_ERROR {
  INVALID_USER = "User does not exist",
  INVALID_CREDENTIALS = "Invalid credentials",
  UNAVAILABLE_CREDENTIALS = "Credentials already in use",
  UNAVAILABLE_EMAIL = "Email already in use",
  UNAVAILABLE_USERNAME = "Username already in use",
  UNVERIFIED_EMAIL = "User account is not created/verified",
  INVALID_EMAIL_VERIFY_EMAIL_TOKEN = "Email verification token is invalid",
  RESET_EMAIL_ALREADY_SENT = "Password reset email has already been sent",
  UPDATE_ERROR = "Update failed",
}

export const VERIFY_EMAIL_OPTIONS = {
  subject: "PeerPrep Email Verification",
  template: "emailVerification",
};

export const RESET_PASSWORD_EMAIL_OPTIONS = {
  subject: "PeerPrep Password Reset",
  template: "resetPassword",
};

export enum API_OPERATIONS {
  SIGN_UP_SUMMARY = "Creates a new user with the provided credentials",
  SIGN_IN_SUMMARY = "Successfully signed in and received JWT token cookies",
  SIGN_OUT_SUMMARY = "Signs the user out",
  REFRESH_SUMMARY = "Refresh JWT token cookies",
  VERIFY_SIGN_UP_SUMMARY = "User verifies their email address for sign up",
  FORGET_PASSWORD_SUMMARY = "User requests to change existing password",
  RESET_PASSWORD_SUMMARY = "User enters new password to change their existing password",
  CHANGE_PASSWORD_SUMMARY = "Changes password of authenicated users",
  JWT_VERIFICATION_TOKEN_SUMMARY = "Verifies that JWT token passed in request is valid",
  RETURN_USER_INFO_WITH_ID_SUMMARY = "Returns info of user with the given id",
  EDIT_USER_INFO_SUMMARY = "Edit data of specified user",
  DELETE_USER_SUMMARY = "Delete data of specified user",
  DELETE_ACCOUNT_SUMMARY = "Deletes user account after verifying the specified password",
  QUESTION_QUERY_SUMMARY = "Retrieves the list of questions that satisfies the conditions in the query",
  QUESTION_DAILY_SUMMARY = "Retrieves today's daily question",
  QUESTION_TOPIC_SUMMARY = "Retrieves the list of question topics",
  QUESTION_DAILY_QUESTION_SUMMARY = "Retrieves the question of the day's summary",
  QUESTION_CONTENT_SLUG_SUMMARY = "Retrieves the summary for the specified question",
  OAUTH_SUCCESSFUL_SIGNED_IN_SUMMARY = "User successfully signed in using github",
  QUERY_SUMMARY = "Retrieves Query in URL",
  OAUTH_SUMMARY = "Login using Oauth",
  QUESTION_INVALIDATE_CACHE = "Invalidates the question cache",
  HISTORY_SUMMARY = "Retrieves the user's match histories",
  QUESTION_SUMMARY = "Retrieves questions summaries and contents",
}

export enum API_RESPONSES_DESCRIPTION {
  SUCCESSFUL_SIGNUP_EMAIL_SENT_DESCRIPTION = "Successfully sent a verification email to the email provided",
  SUCCESSFUL_SIGNOUT_DESCRIPTION = "Successfully signed out and cleared JWT token cookies",
  SUCCESSFUL_SIGNIN_DESCRIPTION = "Successfully signed in and received JWT token cookies",
  SUCCESSFUL_SIGN_UP_VERIFY_DESCRIPTION = "Successfully verified email",
  BAD_REQUEST_DESCRIPTION = "Bad Request: Invalid or missing Input",
  UNAUTHORIZED_SIGN_OUT_DESCRIPTION = "Unauthorized Request: User is not logged in",
  REFRESH_DESCRIPTION = "Successfully refreshed JWT tokens",
  FORBIDDEN_DESCRIPTION = "Client does not have access rights to the requested content",
  SUCCESSFUL_FORGET_PASSWORD_EMAIL_SENT_DESCRIPTION = "Successfully sent a forget password verification email to the email provided",
  BAD_REQUEST_INVALID_CREDENTIALS_DESCRIPTION = "Client provided no credentials or invalid credentials",
  SUCCESSFUL_RESET_PASSWORD_DESCRIPTION = "Successfully reset password",
  SUCCESSFUL_CHANGE_PASSWORD_DESCRIPTION = "Successfully changed password",
  SUCCESSFUL_DELETE_ACCOUNT_DESCRIPTION = "Successfully deleted account",
  UNAUTHORIZED_REQUEST_USER_NOT_LOGGED_IN_DESCRIPTION = "Unauthorized Request: User is not logged in",
  NOT_FOUND_DESCRIPTION = "Not Found: Resource not found",
  SUCCESSFUL_RETRIEVAL_OF_USER_INFORMATION_DESCRIPTION = "The resource was returned successfully",
  UNAUTHORIZED_ACCESS_DESCRIPTION = "Client does not have access rights to the requested content",
  SUCCESSFUL_UPDATE_USER_INFORMATION_DESCRIPTION = "The resource was updated successfully",
  UNABLE_TO_PROCESS_INSTRUCTION_DESCRIPTION = "Unable to process instruction",
  BAD_REQUEST_INVALID_ID_DESCRIPTION = "Client provided no ID or invalid ID",
  BAD_REQUEST_INVALID_INPUT_DESCRIPTION = "Client provided invalid credentials or ID",
  BAD_REQUEST_INVALID_TOKEN_DESCRIPTION = "Client provided invalid token",
  INTERNAL_SERVER_ERROR = "Internal Server Error",
  FORBIDDEN_SIGNUP_DESCRIPTION = "User used an unavailable email/username or has already signed up but have yet to verify account",
  FORBIDDEN_SIGNIN_DESCRIPTION = "User entered invalid credentials or is unverified",
  SUCCESSFUL_QUESTION_QUERY = "Successful question query made",
  SUCCESSFUL_QUESTION_INVALIDATION = "Successfully invalidates the question cache",
  SUCCESSFUL_HISTORY_ADDED = "Successfully added match to user's history",
  SUCCESSFUL_HISTORY_INVALIDATION = "Successfully invalidates the user's history cache",
}
