import { BigHeading } from "src/components";
import { ForgetPasswordForm } from "src/features";

const ForgetPasswordPage = () => {
  return (
    <div className="flex w-full flex-col gap-8 px-4 text-center">
      <BigHeading>Forget Password</BigHeading>
      <ForgetPasswordForm />
    </div>
  );
};

export default ForgetPasswordPage;
