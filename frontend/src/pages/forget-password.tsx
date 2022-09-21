import { ForgetPasswordForm } from "../login/components";

const ForgetPasswordPage = () => {
  return (
    <div className="w-full px-4 flex flex-col text-center mx-auto">
      <h1 className="font-display font-bold leading-tight text-5xl mt-4 mb-12 text-black-600">
        Forget Password
      </h1>
      <ForgetPasswordForm />
    </div>
  );
};

export default ForgetPasswordPage;
