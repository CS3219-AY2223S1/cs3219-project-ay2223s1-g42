import { PropsWithChildren } from "react";
import { useLocation } from "react-router";

import { useGlobalStore } from "src/store";
import { Container } from "./Container";
import { TheNavbar } from "./TheNavbar";
import { TheToast } from "./TheToast";

const RoomContainer = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="px-4 flex flex-col justify-between min-h-screen
      bg-neutral-100 h-[150vh] lg:h-screen lg:max-h-screen max-w-[100vw]"
    >
      <div className="pt-[76px] md:pt-16 h-full">{children}</div>
    </div>
  );
};

const AppContainer = ({ children }: PropsWithChildren) => {
  // fetch me query
  const { user, useGetMe } = useGlobalStore((state) => {
    return {
      user: state.user,
      useGetMe: state.useGetMe,
    };
  });
  useGetMe();

  // current pathname
  const location = useLocation();
  const pathname = location.pathname;
  const isRoomPage = user && pathname.startsWith("/room/");
  const isAuthenticatedPage =
    user && !pathname.includes("verify") && !pathname.includes("reset");

  return (
    <>
      {isRoomPage ? (
        <RoomContainer>{children}</RoomContainer>
      ) : isAuthenticatedPage ? (
        <div className="justify-between min-h-screen bg-neutral-100">
          <Container>{children}</Container>
        </div>
      ) : (
        <Container>{children}</Container>
      )}
    </>
  );
};

const AppLayout = ({ children }: PropsWithChildren) => {
  console.log("app layout re-render!");

  return (
    <>
      <TheNavbar />
      <AppContainer>{children}</AppContainer>
      <TheToast />
    </>
  );
};

export { AppLayout };
