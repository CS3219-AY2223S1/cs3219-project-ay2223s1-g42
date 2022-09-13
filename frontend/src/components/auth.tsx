import { useEffect, useMemo, useRef, useState } from "react";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

import { BlueButton, PrimaryButton, RedButton } from "../components/base";
import { useAuthStore } from "../login/hooks";
import { SignInCredentials, SignUpCredentials } from "../login/types";
import { TextInput } from "./base/input";
// import useSocket from "../hooks/useSocket";
import useSocket from "../hooks/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Toast from "./base/toast";

export default function Auth() {
  // form state
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();

  // user state
  const user = useAuthStore((state) => state.user);
  const useGetMe = useAuthStore((state) => state.getMe);
  const getMe = useGetMe();

  // sign in mutations
  const useSignInMutation = useAuthStore((state) => state.signin);
  const signinMutation = useSignInMutation({
    onSuccess: () => queryClient.invalidateQueries(["me"]),
  });
  const handleSignin = async (credentials: SignInCredentials) => {
    signinMutation.mutate(credentials);
  };

  // sign up mutations
  const useSignUpMutation = useAuthStore((state) => state.signup);
  const signUpMutation = useSignUpMutation({
    onSuccess: () => queryClient.invalidateQueries(["me"]),
  });
  const handleSignup = async (credentials: SignUpCredentials) => {
    signUpMutation.mutate(credentials);
  };

  // sign out mutations
  const useSignOutMutation = useAuthStore((state) => state.signout);
  const signOutMutation = useSignOutMutation({
    onSuccess: () => queryClient.invalidateQueries(["me"]),
  });
  const handleSignout = async () => {
    signOutMutation.mutate();
  };

  useEffect(() => {
    console.log({ user });
  }, [user]);

  const { sendChat } = useSocket();
  const renderCounter = useRef(0);
  renderCounter.current = renderCounter.current + 1;
  // console.log(
  //   `me from auth component render count: ${renderCounter.current}, me: ${me}`
  // );

  return (
    <div className="flex flex-col space-y-2 self-center">
      <div>
        <h2 className="font-display text-2xl font-bold leading-relaxed">
          Sign in via credentials with your email and password below
        </h2>
        <div className="flex flex-col gap-2">
          <TextInput
            label="Email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <TextInput
            label="Username"
            type="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
          <TextInput
            label="Password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          {!user ? (
            <>
              <RedButton
                onClick={(e) => {
                  e.preventDefault();
                  handleSignup({ email, username, password });
                }}
                // className="button block"
                disabled={signUpMutation.isLoading}
              >
                <span>{signUpMutation.isLoading ? "Loading" : "Sign up"}</span>
              </RedButton>
              <BlueButton
                onClick={(e) => {
                  e.preventDefault();
                  handleSignin({ email, password });
                }}
                disabled={signinMutation.isLoading}
              >
                <span>{signinMutation.isLoading ? "Loading" : "Login"}</span>
              </BlueButton>
              <PrimaryButton>Sign in</PrimaryButton>
              <button onClick={sendChat}>send broadcast message</button>
            </>
          ) : (
            <>
              <RedButton onClick={handleSignout}>
                <span>{signOutMutation.isLoading ? "Loading" : "Signout"}</span>
              </RedButton>
              <button onClick={sendChat}>send broadcast message</button>
            </>
          )}
        </div>
        <Toast />
      </div>
    </div>
  );
}
