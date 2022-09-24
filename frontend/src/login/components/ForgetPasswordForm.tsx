import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  SuccessAlert,
  ErrorAlert,
  TextInput,
  PrimaryButton,
  NormalHeading,
} from "src/components";
import { useAuthStore } from "src/hooks";
import { ForgetPasswordInfo, ForgetPasswordInfoSchema } from "../types";

const ForgetPasswordForm = () => {
  // form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgetPasswordInfo>({
    resolver: zodResolver(ForgetPasswordInfoSchema),
  });

  // forget password mutation
  const useForgetPasswordMutation = useAuthStore(
    (state) => state.useForgetPasswordMutation
  );
  const forgetPasswordMutation = useForgetPasswordMutation({
    onSuccess: reset,
  });

  // submit function
  const handleSignin = async (credentials: ForgetPasswordInfo) => {
    forgetPasswordMutation.mutate(credentials);
  };
  const onSubmit = handleSubmit(handleSignin);

  return (
    <div>
      {forgetPasswordMutation.isSuccess ? (
        <SuccessAlert
          title="Email sent!"
          message="Please check your email to reset your password."
        />
      ) : forgetPasswordMutation.isError ? (
        <ErrorAlert
          title="Error occurred!"
          message="Failed to send reset instructions."
        />
      ) : (
        <NormalHeading className="mb-4 text-sm font-normal">
          Please enter your account email address
        </NormalHeading>
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
    </div>
  );
};

export { ForgetPasswordForm };
