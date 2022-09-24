import { Transition } from "@headlessui/react";
import { resolveValue, Toaster, ToastIcon } from "react-hot-toast";

const TheToast = () => {
  return (
    <Toaster position="bottom-center">
      {(t) => (
        <Transition
          appear
          show={t.visible}
          className="transform p-4 flex bg-white border-[1px] border-neutral-900"
          enter="transition-all duration-150"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <ToastIcon toast={t} />
          <p className="px-2">{resolveValue(t.message, t)}</p>
        </Transition>
      )}
    </Toaster>
    // <Toaster
    //   toastOptions={{
    //     className: `round-none bg-white border-[1px] border-neutral-900
    //     shadow-none radix-state-open:animate-toast-slide-in-bottom
    //     md:radix-state-open:animate-toast-slide-in-bottom radix-state-closed:animate-toast-hide
    //     radix-swipe-end:animate-toast-swipe-out translate-x-radix-toast-swipe-move-x
    //     radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]
    //     focus:outline-none focus-visible:ring focus-visible:ring-neutral-800 focus-visible:ring-opacity-75`,
    //     style: {
    //       borderRadius: 0,
    //       boxShadow: "none",
    //     },
    //   }}
    //   containerStyle={{
    //     top: "auto",
    //     bottom: 60,
    //   }}
    // />
  );
  //   return (
  //     <ToastPrimitive.Provider>
  //       <ToastPrimitive.Root
  //         open={open}
  //         onOpenChange={setOpen}
  //         className={cx(
  //           "z-50 fixed bottom-3 inset-x-4 md:top-auto md:max-w-2xl",
  //           "bg-white border-[1px] border-neutral-900",
  //           "radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-bottom",
  //           "radix-state-closed:animate-toast-hide",
  //           "radix-swipe-end:animate-toast-swipe-out",
  //           "translate-x-radix-toast-swipe-move-x",
  //           "radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]",
  //           "focus:outline-none focus-visible:ring focus-visible:ring-neutral-800 focus-visible:ring-opacity-75"
  //         )}
  //       >
  //         <div className="flex">
  //           <div className="w-0 flex-1 flex items-center px-5 py-4">
  //             <div className="w-full radix">
  //               <ToastPrimitive.Title className="text-sm font-medium text-neutral-900 ">
  //                 {status?.status}
  //               </ToastPrimitive.Title>
  //               <ToastPrimitive.Description className="mt-1 text-sm text-neutral-700 ">
  //                 {status?.message}
  //               </ToastPrimitive.Description>
  //             </div>
  //           </div>
  //           <div className="flex">
  //             <div className="flex flex-col px-3 py-2 space-y-1">
  //               <div className="h-0 flex-1 flex">
  //                 <ToastPrimitive.Close
  //                   className="w-full border border-transparent px-3 py-2 flex items-center
  //                   justify-center text-sm font-medium text-neutral-600 hover:bg-neutral-50
  //                   hover:text-neutral-800 focus:z-10 focus:outline-none focus-visible:ring
  //                   focus-visible:ring-neutral-800 focus-visible:ring-opacity-75 duration-200
  //                   ease-out"
  //                 >
  //                   Dismiss
  //                 </ToastPrimitive.Close>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </ToastPrimitive.Root>
  //       <ToastPrimitive.Viewport />
  //     </ToastPrimitive.Provider>
  //   );
};

export { TheToast };
