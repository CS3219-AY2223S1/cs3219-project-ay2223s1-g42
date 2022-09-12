import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../login/hooks";
import { SignInCredentials, SigninCredentialsSchema } from "../login/types";
import {
  BlueButton,
  PrimaryButton,
  RedButton,
  Layout,
} from "../components/base";
import TextInput from "../components/base/input/TextInput";

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
      <div className="w-full max-w-md px-4 flex flex-col text-center space-y-12 mx-auto">
        <h1 className="font-bold leading-tight text-5xl text-black-600">
          Welcome.
        </h1>
        <div>
          <BlueButton className="w-full">
            <div className="flex flex-row space-x-2 justify-center items-center">
              <svg
                className="mr-2 -ml-1 w-4 h-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Login with Google
            </div>
          </BlueButton>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">
              or login with your email
            </span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <div className="flex flex-col gap-3">
            <TextInput
              label="Email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              label="Username"
              type="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextInput
              label="Password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <RedButton className="max-w-lg">Register</RedButton>
          <BlueButton className="max-w-xl">Sign in</BlueButton>
        </div>
      </div>
    </Layout>
  );
}
