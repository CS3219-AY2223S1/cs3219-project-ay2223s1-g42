import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppType } from "next/dist/shared/lib/utils";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "../styles/globals.css";
import AppLayout from "src/components/layout/AppLayout";
import { useAuthStore } from "src/hooks";

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache(),
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default MyApp;
