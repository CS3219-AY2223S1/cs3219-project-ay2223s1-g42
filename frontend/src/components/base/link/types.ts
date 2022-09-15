import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";

export type Props = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & {
  href: string;
  children: React.ReactNode;
};
