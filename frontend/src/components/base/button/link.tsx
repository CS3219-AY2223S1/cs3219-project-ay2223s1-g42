import { ButtonHTMLAttributes } from "react";

export function LinkButton({
  className,
  children,
  ...other
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`font-sans transition duration-300 ease-out border-b-[1px]
      border-transparent hover:border-neutral-800 ${className}`}
      {...other}
    >
      {children}
    </button>
  );
}
