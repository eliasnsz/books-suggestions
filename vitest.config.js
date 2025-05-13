import dotenv from "dotenv";
import { defineConfig } from "vitest/config";

dotenv.config({
  path: ".env",
});

export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    hookTimeout: 1000 * 60, // 60 seconds
  },
});
