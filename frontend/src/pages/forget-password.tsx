import { ForgetPasswordForm } from "../login/components";

const ForgetPasswordPage = () => {
  return (
    <div className="w-full px-4 flex flex-col gap-8 text-center">
      <h4 className="font-display font-bold leading-tight text-4xl text-neutral-800">
        Forget Password
      </h4>
      <ForgetPasswordForm />
    </div>
  );
};

export default ForgetPasswordPage;
