import { Props } from "./types";

const LinkButton = ({ className = "", children, ...other }: Props) => {
  return (
    <button
      className={`border-b-[1px] border-transparent font-sans transition duration-300
      ease-out hover:border-neutral-800 ${className}`}
      {...other}
    >
      {children}
    </button>
  );
};

export { LinkButton };
