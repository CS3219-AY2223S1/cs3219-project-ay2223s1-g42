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
      className={`border-b-[1px] border-transparent text-neutral-400 transition duration-300
      ease-out hover:border-neutral-400  ${className}`}
      {...other}
    >
      {children}
    </BaseLink>
  );
};

export { LightLink };
