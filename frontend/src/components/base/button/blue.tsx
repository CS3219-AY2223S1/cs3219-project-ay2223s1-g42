import { BaseButton } from "./base";
import { Props } from "./types";

const BlueButton = ({ className = "", children, ...other }: Props) => {
  return (
    <BaseButton
      loadColor="neutral-50"
      loadHoverColor="neutral-50"
      className={`border-blue-600 bg-blue-600 text-neutral-50 hover:border-blue-700 hover:bg-blue-700 ${className}`}
      {...other}
    >
      {children}
    </BaseButton>
  );
};

export { BlueButton };
