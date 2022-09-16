import { BaseLink } from "./base";
import { Props } from "./types";

const PrimaryLink = ({ href, children, className = "", ...other }: Props) => {
  return (
    <BaseLink
      href={href}
      className={`transition duration-300 ease-out border-b-[1px]
        border-transparent hover:border-neutral-800 ${className}`}
      {...other}
    >
      {children}
    </BaseLink>
  );
};

export { PrimaryLink };
