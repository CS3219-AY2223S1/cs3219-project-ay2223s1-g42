import axios from "axios";
import type { AppType } from "next/dist/shared/lib/utils";

import { env } from "../env/client.mjs";
import "../styles/globals.css";

axios.defaults.baseURL = env.NEXT_PUBLIC_API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
