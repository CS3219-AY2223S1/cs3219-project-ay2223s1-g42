import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  BlueButton,
  TextInput,
  PrimaryButton,
  LinkButton,
} from "src/components/base";
import { ErrorAlert } from "src/components/base/alert";
import { GoogleIcon } from "src/components/icons";
import { useAuthStore } from "../hooks";
import { useRouter } from "next/router";
import {
  SignInCredentials,
  SigninCredentialsSchema,
  FormProps,
} from "../types";
import { LightLink } from "src/components/base/link";

const LoginForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // sign in mutations
  const useSignInMutation = useAuthStore((state) => state.signin);
  const signinMutation = useSignInMutation({
    onSuccess: () => queryClient.invalidateQueries(["me"]),
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
    signinMutation.mutate(credentials);
    reset();
  };
  const onSubmit = handleSubmit(handleSignin);

  return (
    <>
      {signinMutation.isError && (
        <ErrorAlert
          title={"Login failed!"}
          message={"Invalid login credentials."}
        />
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
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
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
              <LightLink href="/reset-password">Forget password?</LightLink>
            </div>
          </div>
          <PrimaryButton type="submit" isLoading={signinMutation.isLoading}>
            Sign in
          </PrimaryButton>
        </form>
        <LinkButton
          className="self-center mt-3"
          onClick={() => router.push("/signup")}
        >
          Sign up
        </LinkButton>
      </>
    </>
  );
};

export { LoginForm };
