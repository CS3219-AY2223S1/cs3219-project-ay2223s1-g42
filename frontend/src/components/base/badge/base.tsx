import cx from "classnames";

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  uppercase?: boolean;
};

const BaseBadge = ({
  children,
  className,
  uppercase = true,
  ...others
}: Props) => {
  return (
    <div
      className={cx(
        "w-fit border-[1px] py-1 px-2 text-xs font-semibold",
        { uppercase: uppercase },
        className
      )}
      {...others}
    >
      {children}
    </div>
  );
};

export { BaseBadge };
