import React, { HTMLProps, InputHTMLAttributes } from "react";
import cs from "classnames";

type Props = HTMLProps<HTMLInputElement> & {
  label: string;
  isError?: boolean;
  error?: string;
};

const TextInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, className, isError, error, ...other }, ref) => {
    return (
      <div>
        <div className="relative">
          <input
            type="text"
            id={"floating_outlined"}
            ref={ref}
            className={cs(
              "block px-2.5 pb-2.5 pt-4 w-full text-md",
              "bg-transparent border-[1px] appearance-none focus:outline-none",
              "focus:ring-0 focus:border-blue-600 peer placeholder-transparent",
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
            className={cs(
              "absolute text-sm duration-300 transform -translate-y-4 scale-75 text-neutral-500",
              "top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-[6px] peer-placeholder-shown:top-1/2",
              "peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2",
              "peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1",
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
          <p className="mt-2 text-sm text-red-600 text-start">
            <span>Oops! </span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

export { TextInput };
