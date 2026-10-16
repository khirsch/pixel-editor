import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Verify DOM environment is available
if (typeof window === 'undefined' || typeof document === 'undefined') {
  throw new Error(
    '❌ JSDOM NOT LOADED!\n\n' +
    'The test environment is not properly configured.\n' +
    'Make sure:\n' +
    '1. jsdom is installed: npm list jsdom\n' +
    '2. vitest.config.ts has: environment: "jsdom"\n' +
    '3. Run: rm -rf node_modules package-lock.json && npm install\n'
  );
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock canvas context
const mockContext = {
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  globalAlpha: 1,
  imageSmoothingEnabled: true,
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  strokeRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  arc: vi.fn(),
  setLineDash: vi.fn(),
  drawImage: vi.fn(),
  putImageData: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  getImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(400),
    width: 10,
    height: 10,
  })),
  createImageData: vi.fn((width: number, height: number) => ({
    data: new Uint8ClampedArray(width * height * 4),
    width,
    height,
  })),
};

// Mock HTMLCanvasElement methods
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = vi.fn(function(this: HTMLCanvasElement, contextType: string) {
    if (contextType === '2d') {
      return mockContext as unknown as CanvasRenderingContext2D;
    }
    return null;
  }) as any;

  HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock');
  HTMLCanvasElement.prototype.toBlob = vi.fn((callback) => {
    if (callback) {
      callback(new Blob(['mock'], { type: 'image/png' }));
    }
  });
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

console.log('✅ Test setup complete - jsdom loaded successfully');