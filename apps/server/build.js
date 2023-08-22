const esbuild = require("esbuild")

void esbuild.build({
  entryPoints: ["src/app.ts", "src/workers/game.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  outdir: "../../dist",
})
