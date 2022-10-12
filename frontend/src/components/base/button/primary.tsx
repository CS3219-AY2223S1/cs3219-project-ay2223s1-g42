import { BaseButton } from "./base";
import { Props } from "./types";

const PrimaryButton = ({ className = "", children, ...other }: Props) => {
  return (
    <BaseButton
      loadColor="neutral-900"
      loadHoverColor="neutral-50"
      className={`border-neutral-900 bg-white text-neutral-900
      hover:bg-neutral-900 hover:text-neutral-50 ${className}`}
      {...other}
    >
      {children}
    </BaseButton>
  );
};

export { PrimaryButton };
