import React, { useState } from "react";

import { ForgetPasswordForm } from "../login/components";

export default function forgetPassword() {
  const [isSuccess, setSuccess] = useState<boolean>(false);
  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <div className="w-screen max-w-lg px-4 flex flex-col mb-12 text-center space-y-4">
        <h1 className="font-bold leading-tight text-4xl mt-0 mb-2 text-black-600 flex flex-col py-5 text-left">
          Reset Password
        </h1>
        {isSuccess ? (
          <h4 className="leading-tight text-1xl text-black-50 flex flex-col text-left">
            Please check your email for the instructions
          </h4>
        ) : (
          <ForgetPasswordForm setSuccess={setSuccess} />
        )}
      </div>
    </div>
  );
}
