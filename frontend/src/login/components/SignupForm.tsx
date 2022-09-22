import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  BlueButton,
  TextInput,
  PrimaryButton,
  ErrorAlert,
  GoogleIcon,
  PrimaryLink,
  SuccessAlert,
} from "src/components";
import { SignUpCredentials, SignupCredentialsSchema } from "../types";
import { useAuthStore } from "src/hooks";

const SignupForm = () => {
  const queryClient = useQueryClient();

  // form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpCredentials>({
    resolver: zodResolver(SignupCredentialsSchema),
  });

  // sign in mutations
  const useSignUpMutation = useAuthStore((state) => state.useSignupMutation);
  const signupMutation = useSignUpMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
      reset();
    },
  });

  // submit function
  const handleSignup = async (credentials: SignUpCredentials) => {
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
        <BlueButton className="w-full flex items-center justify-center relative">
          <div className="absolute left-0 h-full w-12 bg-neutral-50 flex items-center justify-center">
            <GoogleIcon className="h-5 w-5 text-red-500" />
          </div>
          Sign up with Google
        </BlueButton>
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-neutral-400"></div>
          <span className="text-sm md:text-base flex-shrink mx-4 text-neutral-400">
            Or, sign up with your email
          </span>
          <div className="flex-grow border-t border-neutral-400"></div>
        </div>
        <form
          className="flex flex-col gap-8 space-y-8 mb-3"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-5">
            <TextInput
              label="Email"
              type="email"
              placeholder="name@company.com"
              isError={!!errors.email?.message}
              error={errors.email?.message}
              autoComplete="email"
              {...register("email", { required: true })}
            />
            <TextInput
              label="Username"
              type="text"
              placeholder="Username123"
              isError={!!errors.username?.message}
              error={errors.username?.message?.replace("String", "Username")}
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
