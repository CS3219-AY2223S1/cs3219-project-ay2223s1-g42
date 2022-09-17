import type { NextPage } from "next";
import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { PrimaryButton } from "../components/base";
import { useAuthStore } from "src/login";
import { Spinner } from "src/components/icons";
import { RadioGroupButtons } from "src/components/layout/radiogroup";

const Home: NextPage = () => {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <Spinner className="h-12 w-12" />;
  }
  return (
    <div className="m-auto space-y-10">
      <h1 className="font-display text-5xl text-neutral-900 text-center">
        Welcome to PeerPrep
      </h1>
      <RadioGroupButtons />
      <div className="flex flex-col">
        <PrimaryButton>Match</PrimaryButton>
      </div>
    </div>
  );
};

export default Home;
