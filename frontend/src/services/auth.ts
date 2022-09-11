import axios from "axios";

import { env } from "../env/client.mjs";

export const Axios = axios.create({
  withCredentials: true,
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
