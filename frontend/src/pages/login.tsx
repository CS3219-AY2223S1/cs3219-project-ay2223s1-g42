import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import cs from "classnames";

import {
  useAuthStore,
  SignInCredentials,
  SigninCredentialsSchema,
} from "../login";
import {
  BlueButton,
  PrimaryButton,
  Container,
  LinkButton,
  TextInput,
} from "../components/base";
import { GoogleIcon } from "../components/icons";

export default function login() {
  const queryClient = useQueryClient();

  // sign in mutations
  const useSignInMutation = useAuthStore((state) => state.signin);
  const signinMutation = useSignInMutation({
    onSuccess: () => queryClient.invalidateQueries(["me"]),
  });
  const handleSignin = async (credentials: SignInCredentials) => {
    signinMutation.mutate(credentials);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInCredentials>({
    resolver: zodResolver(SigninCredentialsSchema),
  });

  const onSubmit = handleSubmit(handleSignin);

  return (
    <Container>
      <div className="w-full px-4 flex flex-col text-center mx-auto">
        <h1 className="font-display font-bold leading-tight text-5xl mb-12 text-black-600">
          Welcome.
        </h1>
        <div>
          <BlueButton className="w-full flex items-center justify-center relative">
            <div className="absolute left-0 h-full w-12 bg-neutral-50 flex items-center justify-center">
              <GoogleIcon className="h-5 w-5 text-red-500" />
            </div>
            Sign in with Google
          </BlueButton>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-neutral-400"></div>
            <span className="flex-shrink mx-4 text-neutral-400">
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
                {...register("email", { required: true })}
              />
              <TextInput
                label="Password"
                type="password"
                placeholder="Very$ecureP4ssword"
                isError={!!errors.password?.message}
                error={errors.password?.message}
                {...register("password", { required: true, minLength: 8 })}
              />
              <div className="flex flex-row-reverse">
                <LinkButton className="font-light self-end text-neutral-400 hover:border-b-neutral-400">
                  Forget password?
                </LinkButton>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <PrimaryButton type="submit">Sign in</PrimaryButton>
              <LinkButton className="self-center">Sign up</LinkButton>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}
