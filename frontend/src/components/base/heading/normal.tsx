import { BaseHeading, Props } from "./base";

const NormalHeading = ({ className, children, ...other }: Props) => {
  return (
    <BaseHeading
      className={`text-base font-medium text-neutral-800 md:text-lg ${className}`}
      {...other}
    >
      {children}
    </BaseHeading>
  );
};

export { NormalHeading };
