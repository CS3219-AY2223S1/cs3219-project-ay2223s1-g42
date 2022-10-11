import { z } from "zod";
import { defineConfig } from "@julr/vite-plugin-validate-env";

// env.ts
export default defineConfig({
  validator: "zod",
  schema: {
    VITE_URL: z.string(),
    VITE_API_URL: z.string(),
    VITE_WS_URL: z.string(),
    VITE_OAUTH_URL: z.string(),
    VITE_OAUTH_CLIENT_ID: z.string(),
  },
});
