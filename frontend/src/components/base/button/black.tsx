import { BaseButton } from "./base";
import { Props } from "./types";

export function BlackButton({ className = "", children, ...other }: Props) {
  return (
    <BaseButton
      loadColor="neutral-50"
      loadHoverColor="neutral-50"
      className={`mr-2 mb-2 inline-flex items-center bg-[#24292F] px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-[#24292F]/50 hover:bg-[#24292F]/90 dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 ${className}`}
      {...other}
    >
      {children}
    </BaseButton>
  );
}
