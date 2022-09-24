import { useEffect, useState } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import cx from "classnames";

import { MATCH_EVENTS, ROOM_EVENTS, useSocketStore } from "src/dashboard";

const TheToast = () => {
  const status = useSocketStore((state) => state.status);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!status) {
      return;
    }
    // dont display toast for join queue success events
    if (status.event === MATCH_EVENTS.JOIN_QUEUE_SUCCESS) {
      return;
    }
    setOpen(true);
    const timeout = setTimeout(() => {
      setOpen(false);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [status]);

  return (
    <ToastPrimitive.Provider>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={setOpen}
        className={cx(
          "z-50 fixed bottom-3 inset-x-4 md:top-auto md:max-w-2xl",
          "bg-white border-[1px] border-neutral-900",
          "radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-bottom",
          "radix-state-closed:animate-toast-hide",
          "radix-swipe-end:animate-toast-swipe-out",
          "translate-x-radix-toast-swipe-move-x",
          "radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]",
          "focus:outline-none focus-visible:ring focus-visible:ring-neutral-800 focus-visible:ring-opacity-75"
        )}
      >
        <div className="flex">
          <div className="w-0 flex-1 flex items-center px-5 py-4">
            <div className="w-full radix">
              <ToastPrimitive.Title className="text-sm font-medium text-neutral-900 ">
                {status?.status}
              </ToastPrimitive.Title>
              <ToastPrimitive.Description className="mt-1 text-sm text-neutral-700 ">
                {status?.message}
              </ToastPrimitive.Description>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col px-3 py-2 space-y-1">
              <div className="h-0 flex-1 flex">
                <ToastPrimitive.Close
                  className="w-full border border-transparent px-3 py-2 flex items-center
                  justify-center text-sm font-medium text-neutral-600 hover:bg-neutral-50
                  hover:text-neutral-800 focus:z-10 focus:outline-none focus-visible:ring
                  focus-visible:ring-neutral-800 focus-visible:ring-opacity-75 duration-200
                  ease-out"
                >
                  Dismiss
                </ToastPrimitive.Close>
              </div>
            </div>
          </div>
        </div>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
};

export { TheToast };
