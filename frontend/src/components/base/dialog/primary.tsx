import { Dialog } from "@headlessui/react";

import { BaseDialog, BaseProps } from "./base";

type DialogProps = BaseProps & {
  title: string;
  description: string;
};

export function PrimaryDialog({
  title,
  description,
  isOpen,
  onClose,
  autoClose,
  children,
}: DialogProps) {
  return (
    <BaseDialog isOpen={isOpen} onClose={onClose} autoClose={autoClose}>
      <Dialog.Panel
        className="w-full max-w-md transform overflow-hidden border-[1px] border-neutral-900
        bg-neutral-100 p-4 text-center align-middle transition-all"
      >
        <Dialog.Title
          as="h3"
          className="mb-4 font-display text-2xl font-semibold text-neutral-900"
        >
          {title}
        </Dialog.Title>
        <Dialog.Description className="mb-6">{description}</Dialog.Description>
        {children}
      </Dialog.Panel>
    </BaseDialog>
  );
}
