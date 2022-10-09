import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { OauthQuerySchemaData, OauthLoginResponse } from "shared/api";
import { LoadingLayout, ErrorPage } from "src/components";
import { Axios } from "src/services";

const OauthLogin = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  const code = searchParams.get("code");

  // sign in mutation
  const authQuery = useQuery(
    ["oauth", code],
    () =>
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
    if (authQuery.isSuccess) {
      navigate("/");
    }
  }, [authQuery.isSuccess, navigate]);

  return <>{!loading ? <ErrorPage /> : <LoadingLayout />}</>;
};

export default OauthLogin;
