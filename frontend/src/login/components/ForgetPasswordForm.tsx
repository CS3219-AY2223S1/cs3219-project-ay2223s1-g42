import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TextInput, PrimaryButton } from "src/components/base";
import { useAuthStore } from "../hooks";
import { ForgetPasswordInfo, ForgetPasswordInfoSchema } from "../types";

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
      <h1 className="font-bold leading-tight text-4xl mt-0 mb-2 text-black-600 flex flex-col py-5 text-left">
        Forget Password
      </h1>
      {forgetPasswordMutation.isSuccess ? (
        <h4 className="leading-tight text-1xl text-black-50 flex flex-col text-left">
          Please check your email for the instructions
        </h4>
      ) : (
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
            Send Reset Instructions
          </PrimaryButton>
        </form>
      )}
    </>
  );
};

export { ForgetPasswordForm };
