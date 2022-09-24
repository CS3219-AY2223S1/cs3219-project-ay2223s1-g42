import { BigHeading } from "src/components";
import { SignupForm } from "../login/components";

const SignupPage = () => {
  return (
    <div className="w-full px-4 flex flex-col text-center mx-auto">
      <BigHeading className="mt-4 mb-12">Welcome.</BigHeading>
      <SignupForm />
    </div>
  );
};

export default SignupPage;
