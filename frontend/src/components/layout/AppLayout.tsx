import { PropsWithChildren } from "react";
import { useLocation } from "react-router";

import { useGlobalStore } from "src/store";
import { Container } from "./Container";
import { TheNavbar } from "./TheNavbar";
import { TheToast } from "./TheToast";

const RoomContainer = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="flex h-[150vh] min-h-screen max-w-[100vw] flex-col
      justify-between bg-neutral-100 px-4 lg:h-screen lg:max-h-screen"
    >
      <div className="h-full pt-[76px] md:pt-16">{children}</div>
    </div>
  );
};

const AppContainer = ({ children }: PropsWithChildren) => {
  // fetch me query
  const { user, useGetMe, matchSocket, roomSocket } = useGlobalStore(
    (state) => {
      return {
        user: state.user,
        useGetMe: state.useGetMe,
        matchSocket: state.matchSocket,
        roomSocket: state.roomSocket,
      };
    }
  );
  useGetMe({
    onError: () => {
      matchSocket?.disconnect();
      roomSocket?.disconnect();
    },
  });

  // current pathname
  const location = useLocation();
  const pathname = location.pathname;

  // error page is any nonexistent catch all page
  const isErrorPage =
    !pathname.includes("reset-password") &&
    !pathname.includes("room") &&
    !pathname.includes("verify") &&
    !pathname.includes("forget-password") &&
    !pathname.includes("login") &&
    !pathname.includes("signup") &&
    !pathname.includes("user");

  // authenticated page is any page with user
  // logged in and is not an error page
  const isAuthenticatedPage = user && !isErrorPage;

  // room page is any authenticated page that starts with /room
  const isRoomPage = isAuthenticatedPage && pathname.startsWith("/room/");

  return (
    <>
      {isRoomPage ? (
        <RoomContainer>{children}</RoomContainer>
      ) : isAuthenticatedPage ? (
        <div className="min-h-screen justify-between bg-neutral-100">
          <Container hasTopPadding={true}>{children}</Container>
        </div>
      ) : isErrorPage ? (
        <Container hasTopPadding={false}>{children}</Container>
      ) : (
        <Container>{children}</Container>
      )}
    </>
  );
};

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <TheNavbar />
      <AppContainer>{children}</AppContainer>
      <TheToast />
    </>
  );
};

export { AppLayout };
