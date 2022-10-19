import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { VerifyEmailResponse } from "shared/api";
import { PrimaryButton, LoadingLayout, NormalHeading } from "src/components";
import { Axios } from "src/services";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState<boolean>(true);

  const verifyEmailMutation = useMutation(
    () =>
      Axios.post<VerifyEmailResponse>(`/auth/verify/${token}`).then(
        (res) => res.data
      ),
    {
      onSuccess: () => {
        navigate("/");
      },
      onError: (error) => {
        setLoading(false);
        console.error({ error });
      },
    }
  );

  // navigate to dashboard if verify successful
  useEffect(() => {
    if (!token) {
      console.error(`invalid token value ${token}`);
      return;
    }
    verifyEmailMutation.mutate();
  }, []);

  return (
    <>
      {!loading ? (
        <div className="flex flex-col gap-8 px-4 text-center">
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
