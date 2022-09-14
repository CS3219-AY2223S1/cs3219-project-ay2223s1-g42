import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TextInput, PrimaryButton } from "src/components/base";
import { useAuthStore } from "../hooks";
import {
  ForgetPasswordInfo,
  ForgetPasswordInfoSchema,
  SuccessFormProps,
} from "../types";

const ForgetPasswordForm = ({ setSuccess }: SuccessFormProps) => {
  // forget password mutation
  const useForgetPasswordMutation = useAuthStore(
    (state) => state.forgetPassword
  );
  const forgetPasswordMutation = useForgetPasswordMutation({
    onSuccess: () => setSuccess(true),
  });

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
    </>
  );
};

export { ForgetPasswordForm };
