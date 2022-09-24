import { BaseHeading, Props } from "./base";

const BigHeading = ({ className, children, ...other }: Props) => {
  return (
    <BaseHeading
      className={`text-4xl md:text-5xl text-neutral-900 ${className}`}
      {...other}
    >
      {children}
    </BaseHeading>
  );
};

export { BigHeading };
