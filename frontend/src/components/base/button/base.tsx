import { SpinnerIcon } from "src/components";
import { BaseProps } from "./types";

export function BaseButton({
  className = "",
  children,
  isLoading,
  loadColor = "neutral-900",
  loadHoverColor = "neutral-50",
  ...other
}: BaseProps) {
  return (
    <button
      className={`group flex items-center justify-center border-[1px] p-3 font-sans
      font-medium transition duration-300 ease-out ${className}`}
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
}
