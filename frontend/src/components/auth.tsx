import { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

import { BlueButton, PrimaryButton, RedButton } from "../components/base";
import { useAuthStore } from "../login/hooks";
import { SignInCredentials, SignUpCredentials } from "../login/types";

const serverUrl = "http://localhost:5000";
const websocketUrl = "ws://localhost:5000";

export default function Auth() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isConnected, setIsConnected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (email: string) => {
    // try {
    //   setLoading(true);
    //   const { error } = await supabase.auth.signInWithOtp({ email });
    //   if (error) throw error;
    //   alert("Check your email for the login link!");
    // } catch (error: any) {
    //   alert(error.error_description || error.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  const user = useAuthStore((state) => state.user);
  const useGetMe = useAuthStore((state) => state.getMe);
  const getMe = useGetMe();

  // TODO: auto-refresh every 5 minutes
  const useRefresh = useAuthStore((state) => state.refresh);
  const refreshMutation = useRefresh();

  const useSignInMutation = useAuthStore((state) => state.signin);
  const signinMutation = useSignInMutation();
  const handleSignin = async (credentials: SignInCredentials) => {
    signinMutation.mutate(credentials);
    getMe.refetch();
  };

  const useSignUpMutation = useAuthStore((state) => state.signup);
  const signUpMutation = useSignUpMutation();
  const handleSignup = async (credentials: SignUpCredentials) => {
    signUpMutation.mutate(credentials);
    getMe.refetch();
  };

  const useSignOutMutation = useAuthStore((state) => state.signout);
  const signOutMutation = useSignOutMutation();
  const handleSignout = async () => {
    signOutMutation.mutate();
  };

  useEffect(() => {
    console.log({ user });
  }, [user]);

  useEffect(() => {
    const newSocket = io(websocketUrl, { withCredentials: true });
    newSocket.on("connect", () => {
      console.log("connected to websocket server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("chat", (data) => {
      console.log({ data });
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("chat");
    };
  }, []);

  const sendChat = () => {
    socket?.emit("chat", { message: "hello to chat from client" });
  };

  return (
    <div className="flex flex-col space-y-2 self-center">
      <div>
        <h2 className="font-display text-2xl font-bold leading-relaxed">
          Sign in via credentials with your email and password below
        </h2>
        <div className="flex flex-col gap-2">
          <div>
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              className="inputField"
              type="username"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              className="inputField"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
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
                <span>{loading ? "Loading" : "Sign up"}</span>
              </RedButton>
              <BlueButton
                onClick={(e) => {
                  e.preventDefault();
                  handleSignin({ email, password });
                }}
                disabled={signinMutation.isLoading}
              >
                <span>{loading ? "Loading" : "Login"}</span>
              </BlueButton>
              <PrimaryButton>Sign in</PrimaryButton>
              <button onClick={sendChat}>send broadcast message</button>
            </>
          ) : (
            <RedButton onClick={handleSignout}>Sign out</RedButton>
          )}
        </div>
      </div>
    </div>
  );
}
