import { Props } from "./types";

export function LinkButton({ className = "", children, ...other }: Props) {
  return (
    <button
      className={`border-b-[1px] border-transparent font-sans transition duration-300
      ease-out hover:border-neutral-800 ${className}`}
      {...other}
    >
      {children}
    </button>
  );
}
