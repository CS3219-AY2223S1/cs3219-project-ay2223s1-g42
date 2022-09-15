import { useEffect, useState } from "react";
import { useSocketStore } from "src/hooks/useSocket";

import { Container } from "../components/base";
import { LoginForm, SignupForm } from "../login/components";

export default function login() {
  const [form, setForm] = useState<"signin" | "signup">("signin");
  return (
    <div className="w-full px-4 flex flex-col text-center mx-auto">
      <h1 className="font-display font-bold leading-tight text-5xl mt-4 mb-12 text-black-600">
        Welcome.
      </h1>
      {form === "signin" ? (
        <LoginForm setForm={setForm} />
      ) : (
        <SignupForm setForm={setForm} />
      )}
    </div>
  );
}
