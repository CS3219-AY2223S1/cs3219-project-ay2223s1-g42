import { NavLink, NavLinkProps } from "react-router-dom";

const BaseLink = ({ to, className, children, ...other }: NavLinkProps) => {
  return (
    <NavLink to={to} className={className} {...other}>
      {children}
    </NavLink>
  );
};

export { BaseLink };
