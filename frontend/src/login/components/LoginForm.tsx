import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  BlueButton,
  TextInput,
  PrimaryButton,
  LinkButton,
  RedButton,
  SecondaryButton,
} from "src/components/base";
import { ErrorAlert } from "src/components/base/alert";
import { GoogleIcon } from "src/components/icons";
import { useAuthStore } from "../hooks";
import {
  SignInCredentials,
  SigninCredentialsSchema,
  FormProps,
} from "../types";

const LoginForm = ({ setForm }: FormProps) => {
  const queryClient = useQueryClient();

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
      <div>
        <BlueButton className="relative w-full flex items-center justify-center">
          <div className="absolute left-0 h-full w-12 bg-neutral-50 flex items-center justify-center">
            <GoogleIcon className="h-5 w-5 text-red-500" />
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
              <Link
                className="hover:border-b-neutral-400"
                href="/forget-password"
              >
                <a
                  className="font-sans transition duration-300 ease-out border-b-[1px] 
                  border-transparent hover:border-neutral-400 text-neutral-400"
                >
                  Forget password?
                </a>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <PrimaryButton type="submit" isLoading={signinMutation.isLoading}>
              Sign in
            </PrimaryButton>
            <LinkButton
              className="self-center"
              onClick={() => setForm("signup")}
            >
              Sign up
            </LinkButton>
          </div>
        </form>
      </div>
    </>
  );
};

export { LoginForm };
