import cx from "classnames";

import { BaseBadge, Props } from "./base";

const YellowBadge = ({ children, className, ...others }: Props) => {
  return (
    <BaseBadge
      className={cx(
        "border-yellow-800 bg-yellow-300 text-yellow-800",
        className
      )}
      {...others}
    >
      {children}
    </BaseBadge>
  );
};

export { YellowBadge };
