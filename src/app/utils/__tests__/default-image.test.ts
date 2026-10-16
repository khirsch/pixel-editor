/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest';
import { createDefaultImage } from '../default-image';

describe('default-image', () => {
  describe('createDefaultImage', () => {
    it('creates ImageData with correct dimensions', () => {
      const imageData = createDefaultImage();

      expect(imageData.width).toBe(32);
      expect(imageData.height).toBe(32);
    });

    it('creates ImageData with correct data length', () => {
      const imageData = createDefaultImage();

      // 32 x 32 pixels * 4 channels (RGBA) = 4096
      expect(imageData.data.length).toBe(32 * 32 * 4);
    });

    it('creates non-empty ImageData', () => {
      const imageData = createDefaultImage();

      // Check that not all pixels are transparent black (0,0,0,0)
      let hasNonTransparent = false;
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] !== 0) {
          hasNonTransparent = true;
          break;
        }
      }

      expect(hasNonTransparent).toBe(true);
    });

    it('creates valid pixel data (values 0-255)', () => {
      const imageData = createDefaultImage();

      for (let i = 0; i < imageData.data.length; i++) {
        expect(imageData.data[i]).toBeGreaterThanOrEqual(0);
        expect(imageData.data[i]).toBeLessThanOrEqual(255);
      }
    });

    it('has proper RGBA structure', () => {
      const imageData = createDefaultImage();

      // Check first pixel has 4 channels
      expect(imageData.data.length % 4).toBe(0);
    });

    it('is an instance of ImageData', () => {
      const imageData = createDefaultImage();

      expect(imageData).toBeInstanceOf(ImageData);
    });

    it('creates same dimensions on multiple calls', () => {
      const imageData1 = createDefaultImage();
      const imageData2 = createDefaultImage();

      expect(imageData1.width).toBe(imageData2.width);
      expect(imageData1.height).toBe(imageData2.height);
    });
  });
});