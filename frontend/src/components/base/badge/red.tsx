import cx from "classnames";

import { BaseBadge, Props } from "./base";

const RedBadge = ({ children, className, ...others }: Props) => {
  return (
    <BaseBadge
      className={cx("border-red-800 bg-red-300 text-red-800", className)}
      {...others}
    >
      {children}
    </BaseBadge>
  );
};

export { RedBadge };
