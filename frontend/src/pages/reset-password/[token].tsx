import { useRouter } from "next/router";
import React from "react";

import { ResetPasswordForm } from "../../login/components";

const ResetPasswordPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <div className="w-screen max-w-lg px-4 flex flex-col mb-12 text-center space-y-4">
        <ResetPasswordForm
          token={
            typeof router.query.token === "string" ? router.query.token : ""
          }
        />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
