import { useParams } from "react-router";

import { BigHeading, ErrorPage } from "src/components";
import { ResetPasswordForm } from "src/login";

const ResetPasswordPage = () => {
  const { token } = useParams();
  if (!token) {
    return <ErrorPage />;
  }
  return (
    <div className="flex w-full flex-col gap-8 px-4 text-center">
      <BigHeading>Reset Password</BigHeading>
      <ResetPasswordForm token={token} />
    </div>
  );
};

export default ResetPasswordPage;
