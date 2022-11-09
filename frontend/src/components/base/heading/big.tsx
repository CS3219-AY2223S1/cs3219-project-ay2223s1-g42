import { BaseHeading, Props } from "./base";

const BigHeading = ({ className, children, ...other }: Props) => {
  return (
    <BaseHeading
      className={`text-4xl text-neutral-900 md:text-5xl ${className}`}
      {...other}
    >
      {children}
    </BaseHeading>
  );
};

export { BigHeading };
