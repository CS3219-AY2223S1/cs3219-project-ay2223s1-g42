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

const ResetForm = () => {
  const queryClient = useQueryClient();

  // sign in mutations
  const useSignInMutation = useAuthStore((state) => state.signin);
  const signinMutation = useSignInMutation();

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
    <TextInput
    label="Email Address"
    type="email"
    placeholder="Email Address"
    value={email}
    onChange={(e) => setEmail(e.currentTarget.value)}
  />
  <PrimaryButton className="max-w-3xl">
    Send Reset Instructions
  </PrimaryButton>
  </>
};

export { ResetForm };
