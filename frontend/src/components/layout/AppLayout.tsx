import { useLocation } from "react-router";

import { useAuthStore } from "src/hooks";
import { Container } from "./Container";
import { TheNavbar } from "./TheNavbar";
import { TheToast } from "./TheToast";

type Props = {
  children: JSX.Element;
};

const AppLayout = ({ children }: Props) => {
  console.log("app layout re-render!");
  // fetch me query
  const { user, useGetMe } = useAuthStore((state) => {
    return {
      user: state.user,
      useGetMe: state.useGetMe,
    };
  });

  useGetMe();

  // current pathname
  const location = useLocation();
  const pathname = location.pathname;

  // layout for room page
  if (user && pathname.startsWith("/room")) {
    return (
      <div className="justify-between flex flex-col h-[150vh] lg:h-screen lg:max-h-screen max-w-[100vw] px-4">
        <TheNavbar />
        <div className="pt-[76px] md:pt-16 h-full">{children}</div>
        <TheToast />
      </div>
    );
  }

  // layout for authenticated pages
  if (user && !pathname.includes("verify") && !pathname.includes("reset")) {
    return (
      <div className="justify-between h-[10000px] min-h-screen bg-neutral-100">
        <TheNavbar />
        <Container>{children}</Container>
        <TheToast />
      </div>
    );
  }

  // layout for public pages
  return <Container>{children}</Container>;
};

export { AppLayout };
