import { BigHeading } from "src/components";
import { ForgetPasswordForm } from "../login/components";

const ForgetPasswordPage = () => {
  return (
    <div className="w-full px-4 flex flex-col gap-8 text-center">
      <BigHeading>Forget Password</BigHeading>
      <ForgetPasswordForm />
    </div>
  );
};

export default ForgetPasswordPage;
