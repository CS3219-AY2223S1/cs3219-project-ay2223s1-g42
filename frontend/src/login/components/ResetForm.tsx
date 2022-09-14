import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SuccessAlert } from "src/components/base/alert";

import {
  BlueButton,
  TextInput,
  PrimaryButton,
  LinkButton,
  RedButton,
  SecondaryButton,
} from "src/components/base";
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
    label="Email"
    type="email"
    placeholder="name@company.com"
    isError={!!errors.email?.message}
    error={errors.email?.message}
    autoComplete="email"
    {...register("email", { required: true })}
    />
   <PrimaryButton type="submit" isLoading={signinMutation.isLoading}>
   Submit
   </PrimaryButton>
   <LinkButton
    className="self-center"
    onClick={() =>alert('alert')}>
      
    </LinkButton>
      
    
  </>
  )
};

export { ResetForm };
