import { SpinnerIcon } from "src/components";
import { BaseProps } from "./types";

const BaseButton = ({
  className = "",
  children,
  isLoading,
  loadColor = "neutral-900",
  loadHoverColor = "neutral-50",
  ...other
}: BaseProps) => {
  return (
    <button
      className={`group flex items-center justify-center border-[1px] py-[14px] px-4 font-sans
      text-base font-medium transition duration-300 ease-out ${className}`}
      {...other}
    >
      {isLoading ? (
        <SpinnerIcon
          className={`fill-${loadColor} group-hover:fill-${loadHoverColor}`}
        />
      ) : (
        children
      )}
    </button>
  );
};

export { BaseButton };
