import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { SpinnerIcon } from "src/components";
import { useAuthStore } from "src/hooks";
import { LoginForm } from "../login";

const LoginPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <>
      {user ? (
        <SpinnerIcon className="h-12 w-12" />
      ) : (
        <div className="w-full px-4 flex flex-col text-center mx-auto">
          <h1 className="font-display font-bold leading-tight text-5xl mt-4 mb-12 text-neutral-900">
            Welcome.
          </h1>
          <LoginForm />
        </div>
      )}
    </>
  );
};

export default LoginPage;
