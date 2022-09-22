import { useParams } from "react-router";

import { ResetPasswordForm } from "src/login/components";

const ResetPasswordPage = () => {
  const { token } = useParams();
  return (
    <div className="w-full px-4 flex flex-col gap-8 text-center">
      <h4 className="font-display font-bold leading-tight text-4xl text-neutral-800">
        Reset Password
      </h4>
      <ResetPasswordForm token={typeof token === "string" ? token : ""} />
    </div>
  );
};

export default ResetPasswordPage;
