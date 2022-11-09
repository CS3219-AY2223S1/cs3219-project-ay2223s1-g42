import { Transition } from "@headlessui/react";
import { resolveValue, Toaster, ToastIcon } from "react-hot-toast";

const TheToast = () => {
  return (
    <Toaster position="bottom-center">
      {(t) => (
        <Transition
          appear
          show={t.visible}
          className="flex transform border-[1px] border-neutral-900 bg-white py-[14px] px-4 text-base"
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
  );
};

export { TheToast };
