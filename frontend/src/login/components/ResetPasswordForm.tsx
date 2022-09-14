import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TextInput, PrimaryButton } from "src/components/base";
import { useAuthStore } from "../hooks";
import { ResetPasswordInfo, ResetPasswordInfoSchema } from "../types";

const ResetPasswordForm = () => {
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
  const handleSignin = async (credentials: ResetPasswordInfo) => {
    resetPasswordMutation.mutate(credentials);
    reset();
  };
  const onSubmit = handleSubmit(handleSignin);

  return (
    <>
      <h1 className="font-bold leading-tight text-4xl mt-0 mb-2 text-black-600 flex flex-col py-5 text-left">
        Reset Password
      </h1>
      {resetPasswordMutation.isSuccess ? (
        <h4 className="leading-tight text-1xl text-black-50 flex flex-col text-left">
          Please check your email for the instructions
        </h4>
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
