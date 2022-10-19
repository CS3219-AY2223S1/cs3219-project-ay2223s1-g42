import { GithubIcon } from "src/components";
import { BaseButton } from "./base";
import { Props } from "./types";

const GithubButton = ({ className = "", children, ...other }: Props) => {
  return (
    <BaseButton
      loadColor="neutral-50"
      loadHoverColor="neutral-50"
      className={`mr-2 mb-2 inline-flex items-center bg-[#24292F]
      px-5 text-center text-sm font-medium text-white
      focus:outline-none focus:ring-4 focus:ring-[#24292F]/50
      hover:bg-[#24292F]/90 dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 ${className}`}
      {...other}
    >
      <div className="flex flex-row items-center gap-1 md:gap-3">
        <GithubIcon className="h-8 w-8" />
        {children}
      </div>
    </BaseButton>
  );
};

export { GithubButton };
