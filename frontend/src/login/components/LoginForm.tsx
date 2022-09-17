import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

import { BlueButton, TextInput, PrimaryButton } from "src/components/base";
import { ErrorAlert, SuccessAlert } from "src/components/base/alert";
import { GoogleIcon } from "src/components/icons";
import { SignInCredentials, SigninCredentialsSchema } from "../types";
import { LightLink, PrimaryLink } from "src/components/base/link";
import { useAuthStore } from "src/hooks";

const LoginForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // sign in mutations
  const useSignInMutation = useAuthStore((state) => state.signin);
  const signinMutation = useSignInMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
      router.push("/");
    },
  });

  // form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInCredentials>({
    resolver: zodResolver(SigninCredentialsSchema),
  });

  // submit function
  const handleSignin = async (credentials: SignInCredentials) => {
    console.log("signing in now!!!");
    signinMutation.mutate(credentials);
    reset();
  };
  const onSubmit = handleSubmit(handleSignin);

  return (
    <>
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
      <>
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
              <LightLink href="/forget-password">Forget password?</LightLink>
            </div>
          </div>
          <PrimaryButton type="submit" isLoading={signinMutation.isLoading}>
            Sign in
          </PrimaryButton>
        </form>
        <PrimaryLink className="self-center" href="/signup">
          Sign up
        </PrimaryLink>
      </>
    </>
  );
};

export { LoginForm };
