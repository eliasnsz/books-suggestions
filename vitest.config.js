import dotenv from "dotenv";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

dotenv.config({
  path: ".env.development",
});

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    fileParallelism: false,
    hookTimeout: 1000 * 60, // 60 seconds
  },
});
