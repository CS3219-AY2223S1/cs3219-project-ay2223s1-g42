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
//text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mr-2 mb-2
//hover:border-black-700 hover:bg-black-700 border-black bg-black text-neutral-50 ${className}
