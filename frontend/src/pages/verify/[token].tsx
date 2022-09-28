import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { PrimaryButton, LoadingLayout, NormalHeading } from "src/components";
import { ApiResponse } from "src/login";
import { Axios } from "src/services";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState<boolean>(true);

  // navigate to dashboard if verify successful
  useEffect(() => {
    const fetchVerify = async () => {
      try {
        const res = await Axios.post<ApiResponse>(
          `${import.meta.env.VITE_API_URL}/auth/verify/${token}`
        ).then((resp) => resp.data);
        if (res.message === "success") {
          navigate("/");
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    if (!token) {
      console.error(`invalid token value ${token}`);
      return;
    }
    fetchVerify();
  }, []);

  return (
    <>
      {!loading ? (
        <div className="px-4 flex flex-col text-center gap-8">
          <NormalHeading>
            Email verification failed! Please sign up again
          </NormalHeading>
          <PrimaryButton onClick={() => navigate("/signup")}>
            Sign up
          </PrimaryButton>
        </div>
      ) : (
        <LoadingLayout />
      )}
    </>
  );
};

export default VerifyEmailPage;
