import { useRouter } from "next/router";
import { useEffect } from "react";

import { Spinner } from "src/components/icons";
import { useAuthStore } from "src/hooks";
import { LoginForm } from "../login/components";

export default function login() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);
  return (
    <>
      {user ? (
        <Spinner className="h-12 w-12" />
      ) : (
        <div className="w-full px-4 flex flex-col text-center mx-auto">
          <h1 className="font-display font-bold leading-tight text-5xl mt-4 mb-12 text-black-600">
            Welcome.
          </h1>
          <LoginForm />
        </div>
      )}
    </>
  );
}
