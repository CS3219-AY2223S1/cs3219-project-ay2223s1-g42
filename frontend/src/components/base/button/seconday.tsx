import { ButtonHTMLAttributes } from "react";

import { BaseButton } from "./base";

export function SecondaryButton({
  className,
  children,
  ...other
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <BaseButton
      className={`border-neutral-900 bg-transparent text-neutral-900 hover:bg-neutral-900 hover:text-neutral-50 ${className}`}
      {...other}
    >
      {children}
    </BaseButton>
  );
}
