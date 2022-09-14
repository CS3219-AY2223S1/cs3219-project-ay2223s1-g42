import { TheNavbar } from "../components/layout/navbar";
import { RadioGroupButtons } from "../components/layout/radiogroup";
import { PrimaryButton } from "../components/base/button";
import { Container } from "src/components/layout";

export default function dashboard() {
  return (
    <div className="justify-between h-[10000px] min-h-screen bg-neutral-100">
      <TheNavbar />
      <Container>
        <div className="m-auto space-y-10">
          <h1 className="font-display text-5xl text-neutral-900 text-center">
            Welcome to PeerPrep
          </h1>
          <RadioGroupButtons />
          <div className="flex flex-col">
            <PrimaryButton>Match</PrimaryButton>
          </div>
        </div>
      </Container>
    </div>
  );
}
