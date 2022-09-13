import type { AppType } from "next/dist/shared/lib/utils";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "../styles/globals.css";
import { SocketProvider } from "../hooks/socket";

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache(),
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SocketProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SocketProvider>
  );
};

export default MyApp;
