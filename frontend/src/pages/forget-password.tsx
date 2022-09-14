import React from "react";

import { ForgetPasswordForm } from "../login/components";

export default function forgetPassword() {
  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <div className="w-screen max-w-lg px-4 flex flex-col mb-12 text-center space-y-4">
        <ForgetPasswordForm />
      </div>
    </div>
  );
}
