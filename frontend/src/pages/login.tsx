import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { BigHeading, SpinnerIcon } from "src/components";
import { useGlobalStore } from "src/store";
import { LoginForm } from "../login";

const LoginPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useGlobalStore((state) => state.user);

  useEffect(() => {
    queryClient.refetchQueries(["me"]);
    if (user) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      {user ? (
        <SpinnerIcon className="h-12 w-12" />
      ) : (
        <div className="w-full px-4 flex flex-col text-center mx-auto">
          <BigHeading className="mt-4 mb-12">Welcome.</BigHeading>
          <LoginForm />
        </div>
      )}
    </>
  );
};

export default LoginPage;
