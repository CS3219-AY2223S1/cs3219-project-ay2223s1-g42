import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ResetPasswordData, ResetPasswordSchema } from "shared/api";
import {
  ErrorAlert,
  SuccessAlert,
  TextInput,
  PrimaryButton,
  NormalHeading,
} from "src/components";
import { useGlobalStore } from "src/store";

type Props = {
  token: string;
};

const ResetPasswordForm = ({ token }: Props) => {
  // form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  // forget password mutation
  const useResetPasswordMutation = useGlobalStore(
    (state) => state.useResetPasswordMutation
  );
  const resetPasswordMutation = useResetPasswordMutation({
    onSuccess: reset,
  });

  // submit function
  const handleResetPassword = async (credentials: ResetPasswordData) => {
    const resetData = { ...credentials, token };
    resetPasswordMutation.mutate(resetData);
  };
  const onSubmit = handleSubmit(handleResetPassword);

  return (
    <div>
      {resetPasswordMutation.isError ? (
        <ErrorAlert
          title={"Password reset failed!"}
          message={"Invalid token detected. Please re-submit your email."}
        />
      ) : resetPasswordMutation.isSuccess ? (
        <>
          <SuccessAlert title="Password reset successful!" />
        </>
      ) : (
        <NormalHeading className="mb-4">
          Please enter your new password
        </NormalHeading>
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
    </div>
  );
};

export { ResetPasswordForm };
