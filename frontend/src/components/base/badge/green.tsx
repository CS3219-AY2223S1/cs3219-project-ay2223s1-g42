import cx from "classnames";

import { BaseBadge, Props } from "./base";

const GreenBadge = ({ children, className, ...others }: Props) => {
  return (
    <BaseBadge
      className={cx("border-green-800 bg-green-300 text-green-800", className)}
      {...others}
    >
      {children}
    </BaseBadge>
  );
};

export { GreenBadge };
