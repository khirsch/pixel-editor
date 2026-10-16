/**
 * Creates a classic Mac OS style black and white computer icon
 */
export function createDefaultImage(): ImageData {
  const width = 64;
  const height = 64;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) {
    throw new Error('Failed to create canvas context');
  }

  // Fill with white background
  tempCtx.fillStyle = '#ffffff';
  tempCtx.fillRect(0, 0, width, height);

  // Classic Mac computer icon in black and white (scaled 2x)
  const black = '#000000';
  
  // Monitor outline
  tempCtx.fillStyle = black;
  // Top
  for (let x = 14; x <= 48; x++) tempCtx.fillRect(x, 10, 1, 1);
  // Sides
  for (let y = 11; y <= 36; y++) {
    tempCtx.fillRect(14, y, 1, 1);
    tempCtx.fillRect(48, y, 1, 1);
  }
  // Bottom
  for (let x = 14; x <= 48; x++) tempCtx.fillRect(x, 36, 1, 1);
  
  // Screen inner border
  for (let x = 16; x <= 46; x++) {
    tempCtx.fillRect(x, 12, 1, 1);
    tempCtx.fillRect(x, 34, 1, 1);
  }
  for (let y = 13; y <= 33; y++) {
    tempCtx.fillRect(16, y, 1, 1);
    tempCtx.fillRect(46, y, 1, 1);
  }
  
  // Screen details (simple Mac face/happy Mac) - scaled 2x
  // Eyes - made 2x2 pixels
  tempCtx.fillRect(26, 20, 2, 2);
  tempCtx.fillRect(36, 20, 2, 2);
  // Smile - wider
  tempCtx.fillRect(26, 26, 1, 1);
  tempCtx.fillRect(27, 27, 2, 2);
  tempCtx.fillRect(29, 28, 2, 2);
  tempCtx.fillRect(31, 28, 2, 2);
  tempCtx.fillRect(33, 27, 2, 2);
  tempCtx.fillRect(35, 27, 2, 2);
  tempCtx.fillRect(37, 26, 1, 1);
  
  // Base/stand - scaled 2x
  // Vertical part
  for (let y = 37; y <= 44; y++) {
    tempCtx.fillRect(30, y, 4, 1);
  }
  // Bottom base
  for (let x = 24; x <= 38; x++) {
    tempCtx.fillRect(x, 46, 1, 2);
    tempCtx.fillRect(x, 48, 1, 2);
  }

  return tempCtx.getImageData(0, 0, width, height);
}
