import { Navbar } from "../components/layout/navbar";
import { RadioGroupButtons } from "../components/layout/radio-group";
import { PrimaryButton } from "../components/base/button";

export default function dashboard() {
  return (
    <div className="justify-between min-h-screen bg-neutral-50">
      <Navbar />
      <div className="flex h-screen items-center">
        <div className="m-auto space-y-10">
          <h1 className="text-5xl text-neutral-900">Welcome to PeerPrep</h1>
          <div className="flex flex-col items-center">
            <RadioGroupButtons />
          </div>
          <div className="flex flex-col">
            <PrimaryButton className="bg-white">Match</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
