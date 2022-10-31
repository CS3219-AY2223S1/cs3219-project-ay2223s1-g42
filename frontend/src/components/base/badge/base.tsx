type Props = React.HTMLAttributes<HTMLDivElement>;

const Badge = ({ children, className, ...others }: Props) => {
  return (
    <div
      className={`border-[1px] border-neutral-900 bg-white py-1 px-2
      text-sm capitalize text-neutral-900 ${className ?? ""}`}
      {...others}
    >
      {children}
    </div>
  );
};

export { Badge };
