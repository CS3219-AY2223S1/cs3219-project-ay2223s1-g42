import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TextInput, PrimaryButton } from "src/components/base";
import { useAuthStore } from "../hooks";
import { ForgetPasswordInfo, ForgetPasswordInfoSchema } from "../types";
import { ErrorAlert, SuccessAlert } from "src/components/base/alert";

const ForgetPasswordForm = () => {
  // forget password mutation
  const useForgetPasswordMutation = useAuthStore(
    (state) => state.forgetPassword
  );
  const forgetPasswordMutation = useForgetPasswordMutation();

  // form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgetPasswordInfo>({
    resolver: zodResolver(ForgetPasswordInfoSchema),
  });

  // submit function
  const handleSignin = async (credentials: ForgetPasswordInfo) => {
    forgetPasswordMutation.mutate(credentials);
    reset();
  };
  const onSubmit = handleSubmit(handleSignin);

  return (
    <>
      {forgetPasswordMutation.isSuccess ? (
        <SuccessAlert
          title="Email sent!"
          message="Please check your email for instructions to reset your password."
        />
      ) : forgetPasswordMutation.isError ? (
        <ErrorAlert
          title="Error occurred!"
          message="Failed to send reset instructions email to the provided address"
        />
      ) : (
        <h4 className="leading-tight text-1xl text-black-50 flex flex-col text-center mb-4">
          Please enter your account email address
        </h4>
      )}
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <TextInput
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          isError={!!errors.email?.message}
          error={errors.email?.message}
          {...register("email", { required: true })}
        />
        <PrimaryButton
          className="max-w-3xl"
          type="submit"
          isLoading={forgetPasswordMutation.isLoading}
        >
          Send reset instructions
        </PrimaryButton>
      </form>
    </>
  );
};

export { ForgetPasswordForm };
