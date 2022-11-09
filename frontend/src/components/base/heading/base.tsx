import { PropsWithChildren } from "react";

export type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
> &
  PropsWithChildren;

const BaseHeading = ({ className, children, ...other }: Props) => {
  return (
    <h1
      className={`text-center font-display font-bold leading-tight ${className}`}
      {...other}
    >
      {children}
    </h1>
  );
};

export { BaseHeading };
