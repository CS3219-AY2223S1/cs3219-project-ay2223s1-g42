import type { NextPage } from "next";
import { useState } from "react";

import { PrimaryButton } from "../components/base";
import { Spinner } from "src/components/icons";
import { PoolUser, useAuthStore, useSocketStore } from "src/hooks";
import { MatchDialog, QuestionRadioGroup } from "src/dashboard/components";

const Home: NextPage = () => {
  const user = useAuthStore((state) => state.user);
  const findMatch = useSocketStore((state) => state.findMatch);

  const [isMatchingDialogOpen, setIsMatchingDialogOpen] = useState(false);

  const handleFindMatch = () => {
    if (!user) {
      console.error("user not found, cannot find match");
      return;
    }
    const poolUser: PoolUser = {
      ...user,
      difficulties: ["easy", "medium"],
    };
    setIsMatchingDialogOpen(true);
    findMatch(poolUser);
  };

  if (!user) {
    return <Spinner className="h-12 w-12" />;
  }
  return (
    <div className="m-auto space-y-10">
      <h1 className="font-display text-3xl font-semibold md:text-5xl text-neutral-900 text-center">
        Welcome to PeerPrep
      </h1>
      <QuestionRadioGroup />
      <div className="flex flex-col">
        <PrimaryButton onClick={handleFindMatch}>Match</PrimaryButton>
        <MatchDialog
          isOpen={isMatchingDialogOpen}
          onClose={() => setIsMatchingDialogOpen(false)}
        />
      </div>
    </div>
  );
};

export default Home;
