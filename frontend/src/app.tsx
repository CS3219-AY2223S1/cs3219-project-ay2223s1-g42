import { Suspense, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import shallow from "zustand/shallow";

import "./styles/globals.css";
import routes from "~react-pages";
import { LoadingLayout, AppLayout, ErrorPage } from "./components";
import { useGlobalStore } from "./store";

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache(),
});

const App = () => {
  const { user, matchSocket, roomSocket } = useGlobalStore((state) => {
    return {
      user: state.user,
      matchSocket: state.matchSocket,
      roomSocket: state.roomSocket,
    };
  }, shallow);

  const allRoutes = useRoutes(routes);

  // connects to match and room socket servers
  useEffect(() => {
    if (!matchSocket || !roomSocket || !user) {
      console.error(
        "failed to connect to match socket server, sockets not set or user not logged in"
      );
      return;
    }
    matchSocket.connect();
    roomSocket.connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      matchSocket.disconnect();
      roomSocket.disconnect();
    };
  }, [matchSocket, roomSocket, user]);

  if (!allRoutes) {
    return <ErrorPage />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingLayout />}>
        <AppLayout>{allRoutes}</AppLayout>
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
