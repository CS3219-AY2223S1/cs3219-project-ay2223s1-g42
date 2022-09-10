import { ButtonHTMLAttributes } from "react";

import { BaseButton } from "./base";

export function RedButton({
  className,
  children,
  ...other
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <BaseButton
      className={`border-red-600 bg-red-600 text-neutral-50 hover:bg-red-500 hover:border-red-500 ${className}`}
      {...other}
    >
      {children}
    </BaseButton>
  );
}
