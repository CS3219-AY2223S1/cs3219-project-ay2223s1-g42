import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../login/hooks";
import { SignInCredentials, SigninCredentialsSchema } from "../login/types";
import {
  BlueButton,
  PrimaryButton,
  RedButton,
  Layout,
  SecondaryButton,
  LinkButton,
} from "../components/base";

import GoogleOauth from "../login/components/googleOauth";
import { TextInput } from "../components/base";

type LoginCredentials = {
  email: string;
  username: string;
  password: string;
};

export default function login() {
  const { register, handleSubmit } = useForm<LoginCredentials>();
  const onSubmit = handleSubmit((data) => {
    alert(JSON.stringify(data));
  });

  // form state
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Layout>
      <div className="w-full px-4 flex flex-col text-center space-y-12 mx-auto">
        <h1 className="font-display font-bold leading-tight text-5xl text-black-600">
          Welcome.
        </h1>
        <div>
        <BlueButton className="w-full">
            <GoogleOauth
            label="Sign in with Google"
            className="flex flex-row space-x-2 justify-center items-center"
            />  
          </BlueButton>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-neutral-400"></div>
            <span className="flex-shrink mx-4 text-neutral-400">
              Or, sign in with your email
            </span>
            <div className="flex-grow border-t border-neutral-400"></div>
          </div>
          <div className="flex flex-col gap-4">
            <TextInput
              label="Email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              label="Username"
              type="username"
              placeholder="Username123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextInput
              label="Password"
              type="password"
              placeholder="Very$ecureP4ssword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex flex-row-reverse">
              <LinkButton className="font-light self-end text-neutral-400 hover:border-b-neutral-400">
                Forget password?
              </LinkButton>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <PrimaryButton onSubmit={onSubmit}>Sign in</PrimaryButton>
          <LinkButton className="self-center">Sign up</LinkButton>
        </div>
      </div>
      
      
    </Layout>
  );
}
