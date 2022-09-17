import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ResetPasswordInfo, ResetPasswordInfoSchema } from "../types";
import { PrimaryButton, TextInput } from "src/components/base";
import { ErrorAlert, SuccessAlert } from "src/components/base/alert";
import { PrimaryLink } from "src/components/base/link";
import { useAuthStore } from "src/hooks";

type Props = {
  token: string;
};

const ResetPasswordForm = ({ token }: Props) => {
  // forget password mutation
  const useResetPasswordMutation = useAuthStore((state) => state.resetPassword);
  const resetPasswordMutation = useResetPasswordMutation();

  // form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordInfo>({
    resolver: zodResolver(ResetPasswordInfoSchema),
  });

  // submit function
  const handleResetPassword = async (credentials: ResetPasswordInfo) => {
    const resetData = { ...credentials, token };
    console.log({ resetData });
    resetPasswordMutation.mutate(resetData);
    reset();
  };
  const onSubmit = handleSubmit(handleResetPassword);

  return (
    <>
      {resetPasswordMutation.isError ? (
        <ErrorAlert
          title={"Password reset failed!"}
          message={"Invalid token detected. Please re-submit your email."}
        />
      ) : resetPasswordMutation.isSuccess ? (
        <>
          <SuccessAlert title="Password reset successful!" />
          <PrimaryLink href="/login">Sign in here</PrimaryLink>
        </>
      ) : (
        <h4 className="leading-tight text-1xl text-black-50 flex flex-col text-center mb-4">
          Please enter your new password
        </h4>
      )}
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <TextInput
          label="New Password"
          type="password"
          placeholder="Very$ecureP4ssword"
          isError={!!errors.password?.message}
          error={errors.password?.message}
          autoComplete="new-password"
          {...register("password", { required: true })}
        />
        <PrimaryButton
          className="max-w-3xl"
          type="submit"
          isLoading={resetPasswordMutation.isLoading}
        >
          Reset password
        </PrimaryButton>
      </form>
    </>
  );
};

export { ResetPasswordForm };
