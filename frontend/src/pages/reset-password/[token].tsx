import { useRouter } from "next/router";

import { ResetPasswordForm } from "src/login/components";

const ResetPasswordPage = () => {
  const router = useRouter();

  return (
    <div className="w-full px-4 flex flex-col text-center mx-auto">
      <h1 className="font-display font-bold leading-tight text-5xl mt-4 mb-12 text-black-600">
        Reset Password
      </h1>
      <ResetPasswordForm
        token={typeof router.query.token === "string" ? router.query.token : ""}
      />
    </div>
  );
};

export default ResetPasswordPage;
