import { BaseLink } from "./base";
import { Props } from "./types";

const LightLink = ({ href, children, className = "", ...other }: Props) => {
  return (
    <BaseLink
      href={href}
      className={`transition duration-300 ease-out border-b-[1px] text-neutral-400
      border-transparent hover:border-neutral-400  ${className}`}
      {...other}
    >
      {children}
    </BaseLink>
  );
};

export { LightLink };
