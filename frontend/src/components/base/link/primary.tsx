import type { NavLinkProps } from "react-router-dom";

import { BaseLink } from "./base";

const PrimaryLink = ({
  to,
  children,
  className = "",
  ...other
}: NavLinkProps) => {
  return (
    <BaseLink
      to={to}
      className={`border-b-[1px] border-transparent transition duration-300
        ease-out hover:border-neutral-800 ${className}`}
      {...other}
    >
      {children}
    </BaseLink>
  );
};

export { PrimaryLink };
