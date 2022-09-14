import { ButtonHTMLAttributes } from "react";

export type BaseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadColor: string;
  loadHoverColor: string;
};

export type Props = Omit<BaseProps, "loadColor" | "loadHoverColor">;
