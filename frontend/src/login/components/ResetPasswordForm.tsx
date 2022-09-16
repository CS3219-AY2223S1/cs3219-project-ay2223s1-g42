import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";

import { TextInput, PrimaryButton } from "../../components/base";
import { useAuthStore } from "../hooks";
import { ResetPasswordInfo, ResetPasswordInfoSchema } from "../types";
import { ErrorAlert } from "../../components/base/alert";

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
      {resetPasswordMutation.isError && (
        <ErrorAlert
          title={"Password reset failed!"}
          message={
            "Invalid token, or token has expired. Please submit your email again"
          }
        />
      )}
      <h1 className="font-bold leading-tight text-4xl mt-0 mb-2 text-black-600 flex flex-col py-5 text-left">
        Reset Password
      </h1>
      {resetPasswordMutation.isSuccess ? (
        <>
          <h4 className="leading-tight text-1xl text-black-50 flex flex-col text-left">
            Password Reset is successful!
          </h4>
          <Link className="hover:border-b-neutral-400" href="/login">
            <PrimaryButton type="submit">Sign in here</PrimaryButton>
          </Link>
        </>
      ) : (
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
            Reset Password
          </PrimaryButton>
        </form>
      )}
    </>
  );
};

export { ResetPasswordForm };
