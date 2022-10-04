import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Divider,
  ErrorAlert,
  SuccessAlert,
  BlueButton,
  GoogleIcon,
  TextInput,
  LightLink,
  PrimaryButton,
  PrimaryLink,
} from "src/components";
import { useGlobalStore } from "src/store";
import { SigninData, SigninSchema } from "shared/api";

const LoginForm = () => {
  const queryClient = useQueryClient();

  // form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SigninData>({
    resolver: zodResolver(SigninSchema),
  });

  // sign in mutations
  const useSignInMutation = useGlobalStore((state) => state.useSigninMutation);
  const signinMutation = useSignInMutation({
    onSuccess: () => {
      console.log("invalidating ME query!");
      queryClient.refetchQueries(["me"]);
      reset();
    },
  });

  // submit function
  const handleSignin = async (credentials: SigninData) => {
    signinMutation.mutate(credentials);
  };
  const onSubmit = handleSubmit(handleSignin);
  const path = "/";

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
        <a
          href={`http://github.com/login/oauth/authorize?client_id=${
            import.meta.env.VITE_OAUTH_CLIENT_ID
          }&redirect_uri=${
            import.meta.env.VITE_OAUTH_URL
          }?path=${path}&scope=user:email`}
        >
          <BlueButton className="relative flex w-full items-center justify-center">
            <div className="absolute left-0 flex h-full w-12 items-center justify-center bg-neutral-50">
              <GoogleIcon className="h-5 w-5" />
            </div>
            Sign in with Google
          </BlueButton>
        </a>
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
