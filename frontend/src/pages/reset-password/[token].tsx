import { useParams } from "react-router";
import { BigHeading } from "src/components";
import { BaseHeading } from "src/components/base/heading/base";

import { ResetPasswordForm } from "src/login/components";
import ErrorPage from "../[...all]";

const ResetPasswordPage = () => {
  const { token } = useParams();
  if (!token) {
    return <ErrorPage />;
  }
  return (
    <div className="w-full px-4 flex flex-col gap-8 text-center">
      <BigHeading>Reset Password</BigHeading>
      <ResetPasswordForm token={token} />
    </div>
  );
};

export default ResetPasswordPage;
