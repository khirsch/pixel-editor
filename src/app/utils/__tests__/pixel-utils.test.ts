/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest';
import { hexToRgb, rgbToHex, cloneImageData } from '../pixel-utils';

describe('pixel-utils', () => {
  describe('hexToRgb', () => {
    it('converts valid hex color to RGB', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('converts uppercase hex to RGB', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('converts black to RGB', () => {
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('converts white to RGB', () => {
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('converts mixed case hex to RGB', () => {
      expect(hexToRgb('#aAbBcC')).toEqual({ r: 170, g: 187, b: 204 });
    });

    it('returns null for invalid hex format', () => {
      expect(hexToRgb('invalid')).toBeNull();
      expect(hexToRgb('#12345')).toBeNull();
      expect(hexToRgb('#gg0000')).toBeNull();
      expect(hexToRgb('#ff00')).toBeNull();
      // Note: hexToRgb actually accepts hex without # prefix
      expect(hexToRgb('zzzzzz')).toBeNull();
    });
  });

  describe('rgbToHex', () => {
    it('converts RGB values to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
    });

    it('converts black to hex', () => {
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
    });

    it('converts white to hex', () => {
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
    });

    it('pads single digit hex values with zero', () => {
      expect(rgbToHex(1, 2, 3)).toBe('#010203');
      expect(rgbToHex(15, 15, 15)).toBe('#0f0f0f');
    });

    it('handles mid-range values', () => {
      expect(rgbToHex(128, 128, 128)).toBe('#808080');
      expect(rgbToHex(170, 187, 204)).toBe('#aabbcc');
    });
  });

  describe('hexToRgb and rgbToHex roundtrip', () => {
    it('maintains color integrity through conversion cycle', () => {
      const testColors = [
        '#000000',
        '#ffffff',
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#123456',
        '#abcdef',
      ];

      testColors.forEach((hex) => {
        const rgb = hexToRgb(hex);
        expect(rgb).not.toBeNull();
        if (rgb) {
          const backToHex = rgbToHex(rgb.r, rgb.g, rgb.b);
          expect(backToHex).toBe(hex.toLowerCase());
        }
      });
    });
  });

  describe('cloneImageData', () => {
    it('creates a deep copy of ImageData', () => {
      const original = new ImageData(10, 10);
      // Set some pixel values
      original.data[0] = 255;
      original.data[1] = 128;
      original.data[2] = 64;
      original.data[3] = 255;

      const clone = cloneImageData(original);

      expect(clone.width).toBe(original.width);
      expect(clone.height).toBe(original.height);
      expect(clone.data[0]).toBe(original.data[0]);
      expect(clone.data[1]).toBe(original.data[1]);
      expect(clone.data[2]).toBe(original.data[2]);
      expect(clone.data[3]).toBe(original.data[3]);
    });

    it('creates an independent copy (mutations do not affect original)', () => {
      const original = new ImageData(10, 10);
      original.data[0] = 255;

      const clone = cloneImageData(original);
      clone.data[0] = 0;

      expect(original.data[0]).toBe(255);
      expect(clone.data[0]).toBe(0);
    });

    it('clones ImageData with different dimensions', () => {
      const small = new ImageData(5, 5);
      const large = new ImageData(100, 100);

      const smallClone = cloneImageData(small);
      const largeClone = cloneImageData(large);

      expect(smallClone.width).toBe(5);
      expect(smallClone.height).toBe(5);
      expect(largeClone.width).toBe(100);
      expect(largeClone.height).toBe(100);
    });

    it('preserves all pixel data', () => {
      const original = new ImageData(2, 2);
      // Fill with test pattern
      for (let i = 0; i < original.data.length; i++) {
        original.data[i] = i % 256;
      }

      const clone = cloneImageData(original);

      for (let i = 0; i < original.data.length; i++) {
        expect(clone.data[i]).toBe(original.data[i]);
      }
    });
  });
});