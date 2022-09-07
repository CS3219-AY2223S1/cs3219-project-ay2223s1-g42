import { useEffect, useState } from "react";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

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

  const handleSignup = async (
    email: string,
    username: string,
    password: string
  ) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/auth/local/signup", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("failed to signup");
      }
      console.log("successfully signed up");
      console.log({ response });
      setIsLoggedIn(true);
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/auth/local/signin", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("failed to sign in");
      }
      const res = await response.json();
      console.log("successfully signed in");
      console.log({ res });
      setIsLoggedIn(true);
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("http://localhost:5000/users/me", {
          method: "GET",
          credentials: "include",
        }).then((res) => res.json());

        if (!res) {
          throw new Error("failed to fetch user");
        }

        if (res) {
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error(e);
        setIsLoggedIn(false);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    const newSocket = io("ws://localhost:5000", { withCredentials: true });
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
    <div className="row flex-center flex">
      <div className="col-6 form-widget">
        <div>
          <p className="description">
            Sign in via credentials with your email and password below
          </p>
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
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSignup(email, username, password);
              }}
              className="button block"
              disabled={loading}
            >
              <span>{loading ? "Loading" : "Signup via credentials"}</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleCredentialLogin(email, password);
              }}
              className="button block"
              disabled={loading}
            >
              <span>{loading ? "Loading" : "Login via credentials"}</span>
            </button>
          </div>
          {isLoggedIn && (
            <button onClick={sendChat}>send broadcast message</button>
          )}
        </div>
      </div>
    </div>
  );
}
