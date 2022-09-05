import { useState } from "react";

import { supabase } from "@/lib/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleMagicLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialSignup = async (email: string, password: string) => {
    try {
      setLoading(true);
      const {
        data: { user, session },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      console.log({ user, session });
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const {
        data: { user, session },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      console.log({ user, session });
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row flex-center flex">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + Next.js</h1>
        <div>
          <p className="description">
            Sign in via magic link with your email below
          </p>
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
            <button
              onClick={(e) => {
                e.preventDefault();
                handleMagicLogin(email);
              }}
              className="button block"
              disabled={loading}
            >
              <span>{loading ? "Loading" : "Send magic link"}</span>
            </button>
          </div>
        </div>
        <div>
          <p className="description">
            Sign in via credentials with your email and password below
          </p>
          <div>
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="inputField"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleCredentialSignup(email, password);
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
        </div>
      </div>
    </div>
  );
}
