import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../login/hooks";
import { SignInCredentials, SigninCredentialsSchema } from "../login/types";
import { BlueButton, PrimaryButton, RedButton, Layout } from "../components/base";
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
    <div className="flex flex-col justify-center min-h-screen items-center">
      <div className="w-screen max-w-xl px-4 flex flex-col mb-12 text-center space-y-4">
      <h1 className="font-bold leading-tight text-5xl mt-0 mb-2 text-black-600 flex flex-col justify-center items-center py-5">
        Welcome.
      </h1>
      <button
        type="button"
        className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
      >
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
      </button>
      
      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="flex-shrink mx-4 text-gray-400">or login with your email</span>
        <div className="flex-grow border-t border-gray-400"></div>
        </div>
     
      <div className="flex flex-col gap-3 pb-2">
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
        <Layout className="flex flex-col gap-3">
          <RedButton className="max-w-lg">Register</RedButton>
          <BlueButton className="max-w-xl">Sign in</BlueButton>
        </Layout>
    </div>
  );
}
