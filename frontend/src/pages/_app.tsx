import type { AppType } from "next/dist/shared/lib/utils";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";

import "../styles/globals.css";
import { Axios } from "../services/auth";
import { SocketProvider } from "../context/socket";

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // onError: async (error, query) => {
    //   // error assumed to be axios error
    //   const axiosErr = error as AxiosError;
    //   if (axiosErr.response?.status === 401) {
    //     console.log("Refreshing Token");
    //     await Axios.get("/auth/refresh");
    //     query.invalidate();
    //   }
    // },
  }),
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
