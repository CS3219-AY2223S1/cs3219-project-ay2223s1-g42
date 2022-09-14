import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../login/hooks";
import { SignInCredentials, SigninCredentialsSchema } from "../login/types";
import { BlueButton, PrimaryButton, RedButton } from "../components/base";
import { TextInput } from "../components/base/input";
import { ResetForm } from "src/login/components/resetForm";

export default function resetPassword() {
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <div className="w-screen max-w-lg px-4 flex flex-col mb-12 text-center space-y-4">
        <h1 className="font-bold leading-tight text-4xl mt-0 mb-2 text-black-600 flex flex-col py-5 text-left">
          Reset Password
        </h1>
       <ResetForm/>
      </div>
    </div>
  );
}
