/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest';

describe('Test Setup', () => {
  it('vitest is working', () => {
    expect(true).toBe(true);
  });

  it('can perform basic math', () => {
    expect(1 + 1).toBe(2);
  });

  it('canvas mock is available', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    expect(ctx).toBeTruthy();
  });

  it('ResizeObserver mock is available', () => {
    expect(ResizeObserver).toBeDefined();
    const observer = new ResizeObserver(() => {});
    expect(observer).toBeDefined();
  });

  it('window.matchMedia mock is available', () => {
    expect(window.matchMedia).toBeDefined();
    const result = window.matchMedia('(min-width: 768px)');
    expect(result).toBeDefined();
    expect(result.matches).toBeDefined();
  });
});