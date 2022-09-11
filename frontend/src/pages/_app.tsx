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

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: async (error, query) => {
      // error assumed to be axios error
      const axiosErr = error as AxiosError;
      if (axiosErr.response?.status === 401) {
        console.log("Refreshing Token");
        try {
          const res = await Axios.get("/auth/refresh");
          if (res.status === 200) {
            queryClient.refetchQueries(query.queryKey);
          }
        } catch (err) {
          throw err;
        }
      }
    },
  }),
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />;
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default MyApp;
