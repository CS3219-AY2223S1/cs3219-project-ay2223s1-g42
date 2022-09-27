import { useParams } from "react-router";

import { BigHeading, ErrorPage } from "src/components";
import { ResetPasswordForm } from "src/login";

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
