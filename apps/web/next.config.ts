import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import type { NextConfig } from "next";

// Single source of truth: load the monorepo-root .env (Next only auto-loads the app dir).
loadEnv({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Internal packages ship TypeScript source — transpile them in the app build.
  transpilePackages: [
    "@classroom/api",
    "@classroom/auth",
    "@classroom/db",
    "@classroom/realtime",
    "@classroom/ui",
  ],
};

export default nextConfig;
