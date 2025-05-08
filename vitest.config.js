import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    hookTimeout: 1000 * 60 // 60 seconds
  },
});
