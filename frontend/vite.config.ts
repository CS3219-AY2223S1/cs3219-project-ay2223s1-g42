import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";
import { ValidateEnv } from "@julr/vite-plugin-validate-env";

export default defineConfig((configEnv) => {
  const isDevelopment = configEnv.mode === "development";

  return {
    plugins: [
      react(),
      Pages({
        dirs: "src/pages",
        importMode: "async",
      }),
      ValidateEnv({}),
    ],
    // define: {
    //   global: "({})",
    // },
    resolve: {
      alias: {
        shared: resolve(__dirname, "..", "shared", "src"),
        src: resolve(__dirname, "src"),
        app: resolve(__dirname, "src", "app"),
        components: resolve(__dirname, "src", "components"),
        hooks: resolve(__dirname, "src", "hooks"),
      },
    },
    css: {
      modules: {
        generateScopedName: isDevelopment
          ? "[name]__[local]__[hash:base64:5]"
          : "[hash:base64:5]",
      },
    },
    build: {
      rollupOptions: {
        external: ["zod"],
      },
    },
  };
});
