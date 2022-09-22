import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { PrimaryButton, LoadingLayout } from "src/components";
import { ApiResponse } from "src/login";
import { Axios } from "src/services";

const VerifyEmailPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [verifyRes, setVerifyRes] = useState<string>("");
  const navigate = useNavigate();
  const { token } = useParams();

  const isSuccess = verifyRes === "success";

  useEffect(() => {
    const fetchVerify = async () => {
      try {
        const res = await Axios.post<ApiResponse>(
          `${import.meta.env.VITE_API_URL}/auth/verify/${token}`
        ).then((resp) => resp.data);
        setVerifyRes(res.message);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchVerify();
  }, [token]);

  return (
    <>
      {loading ? (
        <LoadingLayout />
      ) : (
        <div className="px-4 flex flex-col text-center gap-8">
          <h4 className="font-display font-bold leading-tight text-xl text-neutral-800">
            {isSuccess
              ? "Email verification is successful!"
              : "Email verification failed! Please sign up again"}
          </h4>
          <PrimaryButton
            onClick={() => (isSuccess ? navigate("/") : navigate("/signup"))}
          >
            {isSuccess ? "Log in" : "Sign up"}
          </PrimaryButton>
        </div>
      )}
    </>
  );
};

export default VerifyEmailPage;
