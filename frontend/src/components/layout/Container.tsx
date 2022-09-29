import { HtmlHTMLAttributes } from "react";
import cx from "classnames";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  hasTopPadding?: boolean;
};

const Container = ({
  children,
  className = "",
  hasTopPadding = false,
  ...other
}: Props) => {
  return (
    <div
      className={cx(
        "flex max-w-xl items-center justify-center px-4",
        `mx-auto min-h-screen ${className}`,
        { "pt-0": !hasTopPadding, "pt-[76px] md:pt-16": hasTopPadding }
      )}
      {...other}
    >
      {children}
    </div>
  );
};

export { Container };
