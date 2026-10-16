#!/usr/bin/env node

// Simple script to check if test environment is configured correctly
console.log('Checking test environment setup...\n');

// Check if document exists (means jsdom is loaded)
try {
  if (typeof document !== 'undefined') {
    console.log('✓ document is defined (jsdom loaded)');
  } else {
    console.log('✗ document is NOT defined (jsdom not loaded)');
  }
} catch (e) {
  console.log('✗ document check failed:', e.message);
}

// Check if window exists
try {
  if (typeof window !== 'undefined') {
    console.log('✓ window is defined');
  } else {
    console.log('✗ window is NOT defined');
  }
} catch (e) {
  console.log('✗ window check failed:', e.message);
}

// Check if ImageData exists
try {
  if (typeof ImageData !== 'undefined') {
    console.log('✓ ImageData is defined');
    const testImage = new ImageData(10, 10);
    console.log('  - Can create ImageData instances');
  } else {
    console.log('✗ ImageData is NOT defined');
  }
} catch (e) {
  console.log('✗ ImageData check failed:', e.message);
}

// Check canvas
try {
  if (typeof HTMLCanvasElement !== 'undefined') {
    console.log('✓ HTMLCanvasElement is defined');
  } else {
    console.log('✗ HTMLCanvasElement is NOT defined');
  }
} catch (e) {
  console.log('✗ Canvas check failed:', e.message);
}

console.log('\nIf any checks failed, jsdom is not properly configured in vitest.config.ts');
