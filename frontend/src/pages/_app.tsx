import type { AppType } from "next/dist/shared/lib/utils";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { TheNavbar, Container } from "src/components/layout";
import { useAuthStore } from "src/login";
import "../styles/globals.css";

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache(),
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const user = useAuthStore((state) => state.user);
  return (
    <QueryClientProvider client={queryClient}>
      {user ? (
        <div className="justify-between h-[10000px] min-h-screen bg-neutral-100">
          <TheNavbar />
          <Container>
            <Component {...pageProps} />
          </Container>
        </div>
      ) : (
        <Component {...pageProps} />
      )}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default MyApp;
