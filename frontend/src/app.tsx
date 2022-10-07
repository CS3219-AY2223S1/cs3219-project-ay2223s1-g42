import { Suspense, useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import shallow from "zustand/shallow";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

import "./styles/globals.css";
import routes from "~react-pages";
import { LoadingLayout, AppLayout, ErrorPage } from "./components";
import { useGlobalStore } from "./store";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

loader.config({ monaco });

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

  // useEffect(() => {
  //   if (!user) {
  //     navigate(`/login`);
  //   }
  // }, []);

  // connects to match and room socket servers
  useEffect(() => {
    if (!matchSocket || !roomSocket || !user) {
      console.error(
        "failed to connect to match socket server, sockets not set or user not logged in"
      );
      return;
    }
    console.log("connecting to socket servers...");
    matchSocket.connect();
    roomSocket.connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      console.log("disconnecting from socket servers...");
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
