// eslint-disable-next-line @typescript-eslint/no-var-requires
require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/index.js",
    bundle: true,
    minify: true,
    platform: "node",
  })
  .catch(() => process.exit(1));
