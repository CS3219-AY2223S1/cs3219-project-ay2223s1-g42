import { PrimaryButton, RedButton } from "../base";

const TheRoomStatusbar = () => {
  return (
    <nav
      className="fixed bottom-3 left-1/2 z-50 flex h-auto w-full max-w-2xl
    -translate-x-1/2 px-4"
    >
      <div className="flex w-full flex-row justify-between border-[1px] border-neutral-900 bg-white p-2.5">
        <div>room user status</div>
        <div className="flex flex-row gap-2 text-sm">
          <PrimaryButton className="py-2 px-3">Return to room</PrimaryButton>
          <RedButton className="py-2 px-3">Disconnect</RedButton>
        </div>
      </div>
    </nav>
  );
};

export { TheRoomStatusbar };
