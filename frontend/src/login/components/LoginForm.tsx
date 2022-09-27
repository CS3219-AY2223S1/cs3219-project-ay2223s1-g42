import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import {
  ErrorAlert,
  SuccessAlert,
  BlueButton,
  GoogleIcon,
  TextInput,
  LightLink,
  PrimaryButton,
  PrimaryLink,
} from "src/components";
import { SignInCredentials, SigninCredentialsSchema } from "../types";
import { useGlobalStore } from "src/store";

const LoginForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInCredentials>({
    resolver: zodResolver(SigninCredentialsSchema),
  });

  // sign in mutations
  const useSignInMutation = useGlobalStore((state) => state.useSigninMutation);
  const signinMutation = useSignInMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
      reset();
      navigate("/");
    },
  });

  // submit function
  const handleSignin = async (credentials: SignInCredentials) => {
    signinMutation.mutate(credentials);
  };
  const onSubmit = handleSubmit(handleSignin);

  return (
    <div>
      {signinMutation.isError ? (
        <ErrorAlert
          title={"Login failed!"}
          message={"Invalid login credentials."}
        />
      ) : signinMutation.isSuccess ? (
        <SuccessAlert title="Login successful!" message="Redirecting..." />
      ) : (
        <></>
      )}
      <div>
        <BlueButton className="relative w-full flex items-center justify-center">
          <div className="absolute left-0 h-full w-12 bg-neutral-50 flex items-center justify-center">
            <GoogleIcon className="h-5 w-5" />
          </div>
          Sign in with Google
        </BlueButton>
        <div className="flex py-5 items-center">
          <div className="flex-grow border-t border-neutral-400"></div>
          <span className="text-sm md:text-base flex-shrink mx-4 text-neutral-400">
            Or, sign in with your email
          </span>
          <div className="flex-grow border-t border-neutral-400"></div>
        </div>
        <form className="flex flex-col gap-8 mb-3" onSubmit={onSubmit}>
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
              label="Password"
              type="password"
              placeholder="Very$ecureP4ssword"
              isError={!!errors.password?.message}
              error={errors.password?.message}
              autoComplete="current-password"
              {...register("password", { required: true })}
            />
            <div className="flex flex-row-reverse">
              <LightLink to="/forget-password">Forget password?</LightLink>
            </div>
          </div>
          <PrimaryButton type="submit" isLoading={signinMutation.isLoading}>
            Sign in
          </PrimaryButton>
        </form>
        <PrimaryLink className="self-center" to="/signup">
          Sign up
        </PrimaryLink>
      </div>
    </div>
  );
};

export { LoginForm };
