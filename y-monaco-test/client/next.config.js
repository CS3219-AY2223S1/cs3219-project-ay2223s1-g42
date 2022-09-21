const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const { withGlobalCss } = require("next-global-css");
const withConfig = withGlobalCss();
/** @type {import('next').NextConfig} */
module.exports = withConfig({
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer, webpack, dev }) => {
    config.module.rules
      .filter((rule) => rule.oneOf)
      .forEach((rule) => {
        rule.oneOf.forEach((r) => {
          if (
            r.issuer &&
            r.issuer.and &&
            r.issuer.and.length === 1 &&
            r.issuer.and[0].source &&
            r.issuer.and[0].source.replace(/\\/g, "") ===
              path.resolve(process.cwd(), "src/pages/_app")
          ) {
            r.issuer.or = [
              ...r.issuer.and,
              /[\\/]node_modules[\\/]monaco-editor[\\/]/,
            ];
            delete r.issuer.and;
          }
        });
      });

    config.output.globalObject = "self";
    if (!isServer) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: [
            "json",
            "markdown",
            "css",
            "typescript",
            "javascript",
            "html",
            "scss",
            "less",
          ],
          filename: "static/[name].worker.js",
        })
      );
    }
    return config;
  },
});
