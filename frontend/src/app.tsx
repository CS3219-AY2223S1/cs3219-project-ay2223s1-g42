import { Suspense, useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./styles/globals.css";
import routes from "~react-pages";
import { useAuthStore } from "./hooks";
import { LoadingLayout, AppLayout } from "./components";

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache(),
});

const App = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!user) {
  //     navigate(`/login`);
  //   }
  // }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingLayout />}>
        <AppLayout>{useRoutes(routes)}</AppLayout>
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
