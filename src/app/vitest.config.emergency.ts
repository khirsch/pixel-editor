/// <reference types="vitest" />
import { defineConfig } from 'vite';

/**
 * EMERGENCY TEST CONFIG
 * 
 * Use this if vitest.config.ts doesn't work.
 * This is the absolute minimum configuration needed.
 * 
 * Usage: vitest --config vitest.config.emergency.ts
 */

export default defineConfig({
  test: {
    // CRITICAL: Must have jsdom environment for React Testing Library
    environment: 'jsdom',
    
    // Global test functions (describe, it, expect)
    globals: true,
    
    // Setup file with mocks (optional but recommended)
    setupFiles: ['./test/setup.ts'],
  },
});
