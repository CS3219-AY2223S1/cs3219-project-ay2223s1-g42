import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SignupData, SignupResponse, SignupSchema } from "shared/api";
import {
  GithubButton,
  TextInput,
  PrimaryButton,
  ErrorAlert,
  PrimaryLink,
  SuccessAlert,
  Divider,
} from "src/components";
import { Axios } from "src/services";

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

  // sign up mutation
  const signupMutation = useMutation(
    (params: SignupData) =>
      Axios.post<SignupResponse>(`/auth/local/signup`, params).then(
        (res) => res.data
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["me"]);
        reset();
      },
    }
  );

  // submit function
  const handleSignup = (credentials: SignupData) => {
    signupMutation.mutate(credentials);
  };
  const onSubmit = handleSubmit(handleSignup);

  // oauth redirect
  const handleOAuthRedirect = () => {
    window.location.href = `http://github.com/login/oauth/authorize?client_id=${
      import.meta.env.VITE_OAUTH_GITHUB_CLIENT_ID
    }&redirect_uri=${import.meta.env.VITE_OAUTH_GITHUB_URL}&scope=user`;
  };

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
        <GithubButton
          className="relative flex w-full items-center justify-center"
          onClick={handleOAuthRedirect}
        >
          Sign in with GitHub
        </GithubButton>
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
