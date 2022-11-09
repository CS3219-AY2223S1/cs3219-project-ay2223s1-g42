import cx from "classnames";

import { BaseBadge, Props } from "./base";

const PrimaryBadge = ({ children, className, ...others }: Props) => {
  return (
    <BaseBadge
      className={cx("border-neutral-900 bg-white", className)}
      {...others}
    >
      {children}
    </BaseBadge>
  );
};

export { PrimaryBadge };
