import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
    include: ['Source/Tests/**/*.test.ts'],
    coverage:{
      thresholds:{
          functions: 30,
          lines: 30,
          branches:30,
          statements:30
      },
  },
}})
