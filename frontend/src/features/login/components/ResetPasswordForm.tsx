import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import {
  ResetPasswordData,
  ResetPasswordResponse,
  ResetPasswordFormData,
  ResetPasswordFormSchema,
} from "shared/api";
import {
  ErrorAlert,
  SuccessAlert,
  TextInput,
  PrimaryButton,
  NormalHeading,
} from "src/components";
import { Axios } from "src/services";

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
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordFormSchema),
  });

  // reset password mutation
  const resetPasswordMutation = useMutation(
    (params: ResetPasswordData) =>
      Axios.post<ResetPasswordResponse>(`/auth/reset-password`, params).then(
        (res) => res.data
      ),
    {
      onSuccess: () => {
        reset();
      },
      onError: (error) => {
        console.error({ error });
      },
    }
  );

  // submit function
  const handleResetPassword = async (credentials: ResetPasswordFormData) => {
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
