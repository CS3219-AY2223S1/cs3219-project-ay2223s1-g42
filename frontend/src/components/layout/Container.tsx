import { HtmlHTMLAttributes } from "react";

const Container = ({
  children,
  className = "",
  ...other
}: HtmlHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`flex max-w-xl justify-center items-center px-4 mx-auto min-h-screen ${className}`}
      {...other}
    >
      {children}
    </div>
  );
};

export { Container };
