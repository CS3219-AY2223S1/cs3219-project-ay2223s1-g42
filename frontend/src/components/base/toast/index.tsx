import * as ToastPrimitive from "@radix-ui/react-toast";
import cx from "classnames";
import { useState } from "react";

import { PrimaryButton } from "../button";

type Props = {};

const Toast = (props: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <ToastPrimitive.Provider>
      <PrimaryButton
        onClick={() => {
          if (open) {
            setOpen(false);
            setTimeout(() => {
              setOpen(true);
            }, 400);
          } else {
            setOpen(true);
          }
        }}
      >
        Click
      </PrimaryButton>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={setOpen}
        className={cx(
          "z-50 fixed bottom-4 inset-x-4 w-auto left-auto right-auto md:top-auto md:w-full md:max-w-2xl",
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
          <div className="w-0 flex-1 flex items-center pl-5 py-4">
            <div className="w-full radix">
              <ToastPrimitive.Title className="text-sm font-medium text-neutral-900 ">
                Pull Request Review
              </ToastPrimitive.Title>
              <ToastPrimitive.Description className="mt-1 text-sm text-neutral-700 ">
                Someone requested your review on{" "}
                <span className="font-medium">repository/branch</span>
              </ToastPrimitive.Description>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col px-3 py-2 space-y-1">
              <div className="h-0 flex-1 flex">
                <ToastPrimitive.Action
                  altText="view now"
                  className="w-full border-[1px] border-neutral-900 px-3 py-2 flex items-center
                  justify-center text-sm font-medium text-neutral-600 hover:bg-neutral-900
                  hover:text-neutral-50 focus:z-10 focus:outline-none focus-visible:ring
                  focus-visible:ring-neutral-800 focus-visible:ring-opacity-75 duration-200
                  ease-out "
                  onClick={(e) => {
                    e.preventDefault();
                    window.open("https://github.com");
                  }}
                >
                  Review
                </ToastPrimitive.Action>
              </div>
              <div className="h-0 flex-1 flex">
                <ToastPrimitive.Close
                  className="w-full border border-transparent px-3 py-2 flex items-center
                  justify-center text-sm font-medium text-neutral-600 hover:bg-neutral-200
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

export default Toast;
