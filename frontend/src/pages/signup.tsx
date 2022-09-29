import { BigHeading } from "src/components";
import { SignupForm } from "../login/components";

const SignupPage = () => {
  return (
    <div className="mx-auto flex w-full flex-col px-4 text-center">
      <BigHeading className="mt-4 mb-12">Welcome.</BigHeading>
      <SignupForm />
    </div>
  );
};

export default SignupPage;
