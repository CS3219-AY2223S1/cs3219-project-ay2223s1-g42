import { useRouter } from "next/router";
import { useState } from "react";

import { Container } from "../components/base";
import { LoginForm, SignupForm } from "../login/components";

export default function signup() {
  return (
    <Container>
      <div className="w-full px-4 flex flex-col text-center mx-auto">
        <h1 className="font-display font-bold leading-tight text-5xl mt-4 mb-12 text-black-600">
          Welcome.
        </h1>
        <SignupForm />
      </div>
    </Container>
  );
}
