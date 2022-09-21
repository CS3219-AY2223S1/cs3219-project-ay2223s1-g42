import type { NavLinkProps } from "react-router-dom";

import { BaseLink } from "./base";

const LightLink = ({
  to,
  children,
  className = "",
  ...other
}: NavLinkProps) => {
  return (
    <BaseLink
      to={to}
      className={`transition duration-300 ease-out border-b-[1px] text-neutral-400
      border-transparent hover:border-neutral-400  ${className}`}
      {...other}
    >
      {children}
    </BaseLink>
  );
};

export { LightLink };
