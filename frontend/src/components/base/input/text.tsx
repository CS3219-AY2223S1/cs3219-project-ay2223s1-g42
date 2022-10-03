import React, { HTMLProps } from "react";
import cx from "classnames";

type Props = HTMLProps<HTMLInputElement> & {
  label: string;
  isError?: boolean;
  error?: string;
};

const TextInput = React.forwardRef<HTMLInputElement, Props>(
  function ForwardedTextInput(
    { label, className = "", isError, error, ...other },
    ref
  ) {
    return (
      <div>
        <div className="relative">
          <input
            type="text"
            id={`floating_outlined_${other.name}`}
            ref={ref}
            className={cx(
              "text-md block w-full px-2.5 pb-2.5 pt-4",
              "appearance-none border-[1px] bg-transparent focus:outline-none",
              "peer placeholder-transparent focus:border-blue-600 focus:ring-0",
              `focus:placeholder-neutral-400 ${className}`,
              {
                "text-neutral-900": !isError,
                "border-neutral-900": !isError,
                "border-red-500": isError,
                "focus:border-red-500": isError,
              }
            )}
            {...other}
          />
          <label
            htmlFor="floating_outlined"
            className={cx(
              "absolute -translate-y-4 scale-75 transform text-sm text-neutral-500 duration-300",
              "top-2 z-10 origin-[0] bg-neutral-100 px-2 peer-placeholder-shown:top-1/2 peer-focus:px-[6px]",
              "peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100",
              "left-1 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75",
              {
                "peer-focus:text-blue-600": !isError,
                "peer-focus:text-red-500": isError,
              }
            )}
          >
            {label}
          </label>
        </div>
        {isError && (
          <p className="mt-2 text-start text-sm text-red-600">
            <span>Oops! </span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

export { TextInput };
