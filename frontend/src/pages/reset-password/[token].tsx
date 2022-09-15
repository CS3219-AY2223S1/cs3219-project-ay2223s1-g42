import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { env } from "src/env/client.mjs";
import { ApiResponse } from "src/login";
import { Axios } from "src/services/auth";

import { ResetPasswordForm } from "../../login/components";

const ResetPasswordPage: NextPage<ApiResponse> = ({ message }) => {
  const router = useRouter();
  console.log(router.query);

  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <div className="w-screen max-w-lg px-4 flex flex-col mb-12 text-center space-y-4">
        <p>your current id is: {router.query.token}</p>
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
