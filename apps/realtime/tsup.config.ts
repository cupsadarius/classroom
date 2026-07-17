import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node22",
  clean: true,
  // Bundle the workspace TS packages in — they ship source, not built dist.
  noExternal: [/^@classroom\//],
});
