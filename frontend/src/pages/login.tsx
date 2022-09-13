import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  useAuthStore,
  SignInCredentials,
  SigninCredentialsSchema,
  SignUpCredentials,
  SignupCredentialsSchema,
} from "../login";
import {
  BlueButton,
  PrimaryButton,
  Container,
  LinkButton,
  TextInput,
} from "../components/base";
import { GoogleIcon } from "../components/icons";
import { ErrorAlert } from "../components/base/alert";
import { SuccessAlert } from "../components/base/alert/success";

type FormProps = {
  setForm: (form: "signin" | "signup") => void;
};

const SignupForm = ({ setForm }: FormProps) => {
  const queryClient = useQueryClient();

  // sign in mutations
  const useSignUpMutation = useAuthStore((state) => state.signup);
  const signupMutation = useSignUpMutation({
    onSuccess: () => queryClient.invalidateQueries(["me"]),
  });

  // form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpCredentials>({
    resolver: zodResolver(SignupCredentialsSchema),
  });

  // submit function
  const handleSignup = async (credentials: SignUpCredentials) => {
    signupMutation.mutate(credentials);
    reset();
  };
  const onSubmit = handleSubmit(handleSignup);

  return (
    <>
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
        <form className="flex flex-col gap-8 space-y-8" onSubmit={onSubmit}>
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
          <div className="flex flex-col gap-3">
            <PrimaryButton type="submit">Sign up</PrimaryButton>
            <LinkButton
              className="self-center"
              onClick={() => setForm("signin")}
            >
              Sign in
            </LinkButton>
          </div>
        </form>
      </div>
    </>
  );
};

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
        <BlueButton className="w-full flex items-center justify-center relative">
          <div className="absolute left-0 h-full w-12 bg-neutral-50 flex items-center justify-center">
            <GoogleIcon className="h-5 w-5 text-red-500" />
          </div>
          Sign in with Google
        </BlueButton>
        <div className="relative flex py-5 items-center">
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
              <LinkButton className="text-sm md:text-base font-light self-end text-neutral-400 hover:border-b-neutral-400">
                Forget password?
              </LinkButton>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <PrimaryButton type="submit">Sign in</PrimaryButton>
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

export default function login() {
  const [form, setForm] = useState<"signin" | "signup">("signin");

  return (
    <Container>
      <div className="w-full px-4 flex flex-col text-center mx-auto">
        <h1 className="font-display font-bold leading-tight text-5xl mt-4 mb-12 text-black-600">
          Welcome.
        </h1>
        {form === "signin" ? (
          <LoginForm setForm={setForm} />
        ) : (
          <SignupForm setForm={setForm} />
        )}
      </div>
    </Container>
  );
}
