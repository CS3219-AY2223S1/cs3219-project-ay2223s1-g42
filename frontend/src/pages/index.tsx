import type { NextPage } from "next";

import { PrimaryButton } from "../components/base";
import { Spinner } from "src/components/icons";
import { RadioGroupButtons } from "src/components/layout/radiogroup";
import { PoolUser, useAuthStore, useSocketStore } from "src/hooks";

const Home: NextPage = () => {
  const user = useAuthStore((state) => state.user);
  const findMatch = useSocketStore((state) => state.findMatch);
  const handleFindMatch = () => {
    if (!user) {
      console.log("user not found, cannot find match");
      return;
    }
    const poolUser: PoolUser = {
      ...user,
      difficulties: ["easy", "medium"],
    };
    console.log("finding match: ", { poolUser });
    findMatch(poolUser);
  };
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
        <PrimaryButton onClick={handleFindMatch}>Match</PrimaryButton>
      </div>
    </div>
  );
};

export default Home;
