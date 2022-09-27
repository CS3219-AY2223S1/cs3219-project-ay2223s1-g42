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
import { LoadingLayout, AppLayout, ErrorPage } from "./components";
import { useGlobalStore } from "./store";

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache(),
});

const App = () => {
  console.log("app re-render!");
  const user = useGlobalStore((state) => state.user);
  const navigate = useNavigate();

  const allRoutes = useRoutes(routes);

  // useEffect(() => {
  //   if (!user) {
  //     navigate(`/login`);
  //   }
  // }, []);

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
