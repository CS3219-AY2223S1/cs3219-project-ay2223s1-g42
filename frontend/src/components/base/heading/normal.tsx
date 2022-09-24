import { BaseHeading, Props } from "./base";

const NormalHeading = ({ className, children, ...other }: Props) => {
  return (
    <BaseHeading
      className={`text-base font-medium md:text-lg text-neutral-800 ${className}`}
      {...other}
    >
      {children}
    </BaseHeading>
  );
};

export { NormalHeading };
