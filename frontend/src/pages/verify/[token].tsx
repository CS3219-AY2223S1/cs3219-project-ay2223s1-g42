import { useEffect, useState } from "react";

import { PrimaryButton, PrimaryLink, BaseLink } from "src/components/base";
import { ApiResponse } from "src/login";
import { Axios } from "src/services/auth";

type VerifyEmailPageProps = {
  token: string;
};

const VerifyEmailPage = ({ token }: VerifyEmailPageProps) => {
  const [verifyRes, setVerifyRes] = useState<{ message: string }>();

  useEffect(() => {
    const fetchVerify = async () => {
      const res = await Axios.post<ApiResponse>(
        `${import.meta.env.VITE_API_URL}/auth/verify/${token}`
      ).then((resp) => resp.data);
      setVerifyRes(res);
    };
    fetchVerify();
  }, [token]);

  const isSuccess = verifyRes?.message === "success";
  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <div className="w-screen max-w-lg px-4 flex flex-col mb-12 text-center space-y-4">
        {isSuccess ? (
          <>
            <h4 className="leading-tight text-1xl text-black-50 flex flex-col text-left">
              Email verification is successful!
            </h4>
            <PrimaryLink to="/">Return home</PrimaryLink>
          </>
        ) : (
          <>
            <h4 className="leading-tight text-1xl text-black-50 flex flex-col text-left">
              Email verification failed! Please sign up again
            </h4>
            <BaseLink className="hover:border-b-neutral-400" to="/login">
              <PrimaryButton type="submit">Sign up</PrimaryButton>
            </BaseLink>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
