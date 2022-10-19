import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { BigHeading } from "src/components";
import { useGlobalStore } from "src/store";
import { SignupForm } from "src/features/login";

const SignupPage = () => {
  const navigate = useNavigate();
  const user = useGlobalStore((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="mx-auto flex w-full flex-col px-4 text-center">
      <BigHeading className="mt-4 mb-12">Welcome.</BigHeading>
      <SignupForm />
    </div>
  );
};

export default SignupPage;
