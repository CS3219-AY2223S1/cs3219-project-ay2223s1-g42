import cx from "classnames";

type Props = React.HTMLAttributes<HTMLDivElement>;

const Badge = ({ children, className, ...others }: Props) => {
  return (
    <div
      className={cx(
        "w-fit border-[1px] border-neutral-900 bg-white py-1 px-2 text-xs font-semibold uppercase",
        className
      )}
      {...others}
    >
      {children}
    </div>
  );
};

export { Badge };
