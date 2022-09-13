import { BaseButton } from "./base";
import { Props } from "./types";

export function SecondaryButton({ className, children, ...other }: Props) {
  return (
    <BaseButton
      loadColor="neutral-900"
      loadHoverColor="neutral-50"
      className={`border-neutral-900 bg-transparent text-neutral-900 hover:bg-neutral-900 hover:text-neutral-50 ${className}`}
      {...other}
    >
      {children}
    </BaseButton>
  );
}
