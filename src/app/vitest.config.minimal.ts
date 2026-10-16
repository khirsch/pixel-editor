import { defineConfig } from 'vitest/config';

// Minimal configuration - use this if the main config doesn't work
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
