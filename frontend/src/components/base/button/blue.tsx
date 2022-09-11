import { ButtonHTMLAttributes } from "react";

import { BaseButton } from "./base";

export function BlueButton({
  className,
  children,
  ...other
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <BaseButton
      className={`border-blue-600 bg-blue-600 text-neutral-50 hover:bg-blue-500 hover:border-blue-500 ${className}`}
      {...other}
    >
      {children}
    </BaseButton>
  );
}
