import Link from "next/link";

import { Props } from "./types";

const BaseLink = ({ href, children, className = "", ...other }: Props) => {
  return (
    <Link href={href}>
      <a className={className} {...other}>
        {children}
      </a>
    </Link>
  );
};

export { BaseLink };
