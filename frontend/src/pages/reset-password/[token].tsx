import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { ResetPasswordForm } from "../../login/components";

export default function resetPassword() {
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    console.log(router.query.token as string);
    // codes using router.query
  }, [router.isReady]);

  return (
    <div className="flex flex-col justify-center min-h-screen items-center">
      <div className="w-screen max-w-lg px-4 flex flex-col mb-12 text-center space-y-4">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
