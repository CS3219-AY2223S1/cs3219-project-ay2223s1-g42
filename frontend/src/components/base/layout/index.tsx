import { HtmlHTMLAttributes } from "react";
import { Navbar } from "../navbar";

export function Layout({
  children,
  ...other
}: HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex mt-8 max-w-5xl justify-center mx-auto" {...other}>
      {children}
    </div>
  );
}
