import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { useLocation } from "react-router";
import shallow from "zustand/shallow";

import { GetMeResponse } from "shared/api";
import { useGlobalStore } from "src/store";
import { Axios } from "src/services";
import { Container } from "./Container";
import { TheNavbar } from "./TheNavbar";
import { TheToast } from "./TheToast";
import { TheRoomStatusbar } from "./TheRoomStatusbar";

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
  const { user, setUser, room, matchSocket, roomSocket } = useGlobalStore(
    (state) => {
      return {
        user: state.user,
        setUser: state.setUser,
        room: state.room,
        matchSocket: state.matchSocket,
        roomSocket: state.roomSocket,
      };
    },
    shallow
  );

  useQuery(
    ["me"],
    () => Axios.get<GetMeResponse>("/users/me").then((res) => res.data),
    {
      onSuccess: (data) => {
        setUser(data);
        if (matchSocket?.connected && roomSocket?.connected) {
          return;
        }
        matchSocket?.connect();
        roomSocket?.connect();
      },
      onError: (err) => {
        console.error({ err });
        if (!matchSocket?.connected && !roomSocket?.connected) {
          return;
        }
        matchSocket?.disconnect();
        roomSocket?.disconnect();
      },
    }
  );

  // current pathname
  const location = useLocation();
  const pathname = location.pathname;

  // error page is any nonexistent catch all page
  const isErrorPage =
    pathname !== "/" &&
    !pathname.includes("reset-password") &&
    !pathname.includes("room") &&
    !pathname.includes("verify") &&
    !pathname.includes("forget-password") &&
    !pathname.includes("login") &&
    !pathname.includes("signup") &&
    !pathname.includes("user") &&
    !pathname.includes("questions") &&
    !pathname.includes("question");

  // authenticated page is any page with user
  // logged in and is not an error page
  const isAuthenticatedPage = user && !isErrorPage;

  // room page is any authenticated page that starts with /room
  const isRoomPage =
    (isAuthenticatedPage && pathname.startsWith("/room/")) ||
    (pathname.startsWith("/question") && !pathname.includes("/questions"));

  return (
    <>
      {isRoomPage ? (
        <RoomContainer>{children}</RoomContainer>
      ) : isAuthenticatedPage ? (
        <div className="relative min-h-screen justify-between">
          <Container hasTopPadding={true}>{children}</Container>
          {room && <TheRoomStatusbar room={room} />}
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
