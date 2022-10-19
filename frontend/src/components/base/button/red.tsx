import { BaseButton } from "./base";
import { Props } from "./types";

const RedButton = ({ className = "", children, ...other }: Props) => {
  return (
    <BaseButton
      loadColor="neutral-50"
      loadHoverColor="neutral-50"
      className={`border-red-600 bg-red-600 text-neutral-50 hover:border-red-500 hover:bg-red-500 ${className}`}
      {...other}
    >
      {children}
    </BaseButton>
  );
};

export { RedButton };
