import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";
import { ValidateEnv } from "@julr/vite-plugin-validate-env";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
// import * as process from "process";

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
      monacoEditorPlugin({
        globalAPI: true,
        languageWorkers: ["editorWorkerService", "json", "typescript"],
      }),
    ],
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    resolve: {
      alias: {
        src: resolve(__dirname, "src"),
        app: resolve(__dirname, "src", "app"),
        components: resolve(__dirname, "src", "components"),
        hooks: resolve(__dirname, "src", "hooks"),
        shared: resolve(__dirname, "..", "shared", "src"),
        "readable-stream": "vite-compatible-readable-stream",
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
      minify: true,
      target: "esnext",
    },
    server: {
      port: 3069,
    },
  };
});
