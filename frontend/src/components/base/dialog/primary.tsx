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
  children,
}: DialogProps) {
  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <Dialog.Panel
        className="w-full max-w-md transform overflow-hidden bg-neutral-100 p-4
        text-left align-middle transition-all border-[1px] border-neutral-900"
      >
        <Dialog.Title
          as="h3"
          className="text-2xl font-display font-semibold text-neutral-900 mb-4"
        >
          {title}
        </Dialog.Title>
        <Dialog.Description className="mb-6">{description}</Dialog.Description>
        {children}
      </Dialog.Panel>
    </BaseDialog>
  );
}
