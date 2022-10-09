import { LoadingLayout, ErrorPage } from "src/components";
import { Axios } from "src/services";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ApiResponse } from "src/features";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { QuerySchemaData, OauthLoginResponse } from "shared/api";

const OauthLogin = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();
  // sign in mutation
  const OauthMutation = useMutation(
    (code: string) =>
      Axios.get<OauthLoginResponse>(`/auth/local/oauth?code=${code}`).then(
        (res) => res.data
      ),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["me"]);
        navigate("/");
      },
      onError: (error) => {
        console.error({ error });
      },
    }
  );

  // navigate to dashboard if verify successful
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setLoading(false);
      return;
    }
    OauthMutation.mutate(code);
  }, [searchParams]);

  // navigate to dashboard if verify successful
  useEffect(() => {
    if (OauthMutation.isSuccess) {
      navigate("/");
    }
  }, [OauthMutation.isSuccess, navigate]);

  return <>{!loading ? <ErrorPage /> : <LoadingLayout />}</>;
};

export default OauthLogin;
