import { HTMLAttributes } from "react";

export type Props = HTMLAttributes<HTMLDivElement> & {
  title: string;
  message?: string;
};

const BaseAlert = ({ title, message, className, ...other }: Props) => {
  return (
    <div
      className={`mb-4 py-4 px-[14px] text-sm md:text-base ${className ?? ""}`}
      role="alert"
      {...other}
    >
      <span className="font-medium">{title}</span> {message}
    </div>
  );
};

export { BaseAlert };
