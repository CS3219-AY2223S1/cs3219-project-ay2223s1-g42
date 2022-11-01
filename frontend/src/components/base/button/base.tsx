import cx from "classnames";

import { SpinnerIcon } from "src/components";
import { BaseProps } from "./types";

const BaseButton = ({
  className = "",
  children,
  isLoading,
  hasDefaultPadding = true,
  loadColor = "neutral-900",
  loadHoverColor = "neutral-50",
  ...other
}: BaseProps) => {
  return (
    <button
      className={cx(
        `group flex items-center justify-center border-[1px] font-sans
        text-base font-medium transition duration-300 ease-out`,
        className,
        {
          "py-[14px] px-4": hasDefaultPadding,
        }
      )}
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
