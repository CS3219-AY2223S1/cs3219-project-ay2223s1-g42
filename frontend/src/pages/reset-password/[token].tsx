import { ResetPasswordForm } from "src/login/components";

type ResetPasswordPageProps = {
  token: string;
};

const ResetPasswordPage = ({ token }: ResetPasswordPageProps) => {
  return (
    <div className="w-full px-4 flex flex-col text-center mx-auto">
      <h1 className="font-display font-bold leading-tight text-5xl mt-4 mb-12 text-black-600">
        Reset Password
      </h1>
      <ResetPasswordForm token={typeof token === "string" ? token : ""} />
    </div>
  );
};

export default ResetPasswordPage;
