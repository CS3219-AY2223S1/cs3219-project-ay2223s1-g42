import React, { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function TextInput({ label, className, ...other }: Props) {
  return (
    <div className="relative">
      <input
        type="text"
        id={"floating_outlined"}
        className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-neutral-900 bg-transparent border-[1px] border-neutral-900 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer ${className}`}
        {...other}
      />
      <label
        htmlFor="floating_outlined"
        className="absolute text-sm text-neutral-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-[6px] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
      >
        {label}
      </label>
    </div>
  );
}
