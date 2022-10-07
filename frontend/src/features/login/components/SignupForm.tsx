import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SignupData, SignupSchema } from "shared/api";
import {
  BlueButton,
  TextInput,
  PrimaryButton,
  ErrorAlert,
  GoogleIcon,
  PrimaryLink,
  SuccessAlert,
  Divider,
} from "src/components";
import { useGlobalStore } from "src/store";

const SignupForm = () => {
  const queryClient = useQueryClient();

  // form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(SignupSchema),
  });

  // sign in mutations
  const useSignUpMutation = useGlobalStore((state) => state.useSignupMutation);
  const signupMutation = useSignUpMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
      reset();
    },
  });

  // submit function
  const handleSignup = async (credentials: SignupData) => {
    signupMutation.mutate(credentials);
  };
  const onSubmit = handleSubmit(handleSignup);

  return (
    <div>
      {signupMutation.isError ? (
        <ErrorAlert
          title={"Sign up failed!"}
          message={"An error occurred while signing up."}
        />
      ) : signupMutation.isSuccess ? (
        <SuccessAlert
          title="Sign up successful!"
          message="An email has been sent to your email address. Please verify your email address to continue."
        />
      ) : (
        <></>
      )}
      <div>
        <BlueButton className="relative flex w-full items-center justify-center">
          <div className="absolute left-0 flex h-full w-12 items-center justify-center bg-neutral-50">
            <GoogleIcon className="h-5 w-5 text-red-500" />
          </div>
          Sign up with Google
        </BlueButton>
        <Divider label="Or, sign up with your email" />
        <form
          className="mb-3 flex flex-col gap-8 space-y-8"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-5">
            <TextInput
              label="Email"
              type="email"
              placeholder="name@company.com"
              isError={!!errors.email?.message}
              error={errors.email?.message?.toString()}
              autoComplete="email"
              {...register("email", { required: true })}
            />
            <TextInput
              label="Username"
              type="text"
              placeholder="Username123"
              isError={!!errors.username?.message}
              error={errors.username?.message
                ?.toString()
                .replace("String", "Username")}
              autoComplete="username"
              {...register("username", { required: true })}
            />
            <TextInput
              label="Password"
              type="password"
              placeholder="Very$ecureP4ssword"
              isError={!!errors.password?.message}
              error={errors.password?.message}
              autoComplete="new-password"
              {...register("password", { required: true })}
            />
          </div>
          <PrimaryButton type="submit" isLoading={signupMutation.isLoading}>
            Sign up
          </PrimaryButton>
        </form>
        <PrimaryLink className="self-center" to="/login">
          Sign in
        </PrimaryLink>
      </div>
    </div>
  );
};

export { SignupForm };
