const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["./index.ts"],
  outdir: "./dist",
  bundle: true,
  platform: "node",
  format: "cjs",
});
