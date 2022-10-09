import { LoadingLayout, ErrorPage } from "src/components";
import { Axios } from "src/services";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ApiResponse } from "src/features";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

const OauthLogin = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);

  // navigate to dashboard if verify successful
  useEffect(() => {
    const code = searchParams.get("code");
    const fetchVerify = async () => {
      try {
        const res = await Axios.get<ApiResponse>(
          `/auth/local/oauth?code=${code}`
        ).then((resp) => resp.data);
        if (res.message === "success") {
          console.log(res.message);
          navigate("/");
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    if (!code) {
      console.error(`invalid github token value ${code}`);
      return;
    }
    console.log(code);
    fetchVerify();
  }, [searchParams]);

  return <>{!loading ? <ErrorPage /> : <LoadingLayout />}</>;
};

export default OauthLogin;
