import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SigninData, SigninResponse, SigninSchema } from "shared/api";
import {
  Divider,
  ErrorAlert,
  SuccessAlert,
  GithubButton,
  TextInput,
  LightLink,
  PrimaryButton,
  PrimaryLink,
} from "src/components";
import { Axios } from "src/services";

const LoginForm = () => {
  const queryClient = useQueryClient();
  const [oAuthLoading, setOAuthLoading] = useState<boolean>(false);

  // form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SigninData>({
    resolver: zodResolver(SigninSchema),
  });

  // sign in mutation
  const signinMutation = useMutation(
    (params: SigninData) =>
      Axios.post<SigninResponse>(`/auth/local/signin`, params).then(
        (res) => res.data
      ),
    {
      onSuccess: () => {
        queryClient.refetchQueries(["me"]);
        reset();
      },
      onError: (error) => {
        console.error({ error });
      },
    }
  );

  // submit function
  const handleSignin = async (credentials: SigninData) => {
    signinMutation.mutate(credentials);
  };
  const onSubmit = handleSubmit(handleSignin);

  // oauth redirect
  const handleOAuthRedirect = () => {
    setOAuthLoading(true);
    const githubClientId = import.meta.env.VITE_OAUTH_GITHUB_CLIENT_ID;
    const githubRedirectUri = import.meta.env.VITE_OAUTH_GITHUB_URL;
    window.location.href = `http://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${githubRedirectUri}&scope=user`;
  };

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
        <GithubButton
          className="relative flex w-full items-center justify-center"
          onClick={handleOAuthRedirect}
          isLoading={oAuthLoading}
        >
          Sign in with GitHub
        </GithubButton>
        <Divider label="Or, sign in with your email" />
        <form className="mb-3 flex flex-col gap-8" onSubmit={onSubmit}>
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
