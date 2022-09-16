import { Spinner } from "src/components/icons";
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
      className={`group flex font-sans font-medium transition duration-300 px-3 py-3
      ease-out border-[1px] justify-center items-center ${className}`}
      {...other}
    >
      {isLoading ? (
        <Spinner
          className={`fill-${loadColor} group-hover:fill-${loadHoverColor}`}
        />
      ) : (
        children
      )}
    </button>
  );
}
