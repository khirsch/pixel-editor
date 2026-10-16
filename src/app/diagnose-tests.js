#!/usr/bin/env node

console.log('🔍 Diagnosing Test Environment\n');

// Check Node version
console.log('1️⃣ Node Version:');
console.log(`   ${process.version}`);
const nodeMajor = parseInt(process.version.slice(1).split('.')[0]);
if (nodeMajor < 18) {
  console.log('   ❌ Node 18+ required for jsdom@23+');
} else {
  console.log('   ✅ Node version OK');
}
console.log('');

// Check if node_modules exists
const fs = require('fs');
const path = require('path');

console.log('2️⃣ Dependencies:');
const nodeModulesExists = fs.existsSync(path.join(process.cwd(), 'node_modules'));
if (!nodeModulesExists) {
  console.log('   ❌ node_modules not found - run: npm install');
  process.exit(1);
} else {
  console.log('   ✅ node_modules exists');
}

// Check for jsdom
const jsdomPath = path.join(process.cwd(), 'node_modules', 'jsdom');
const jsdomExists = fs.existsSync(jsdomPath);
console.log(`   jsdom: ${jsdomExists ? '✅ installed' : '❌ NOT FOUND'}`);

if (jsdomExists) {
  try {
    const jsdomPkg = require(path.join(jsdomPath, 'package.json'));
    console.log(`   jsdom version: ${jsdomPkg.version}`);
  } catch (e) {
    console.log('   ⚠️  Could not read jsdom version');
  }
}

// Check for vitest
const vitestPath = path.join(process.cwd(), 'node_modules', 'vitest');
const vitestExists = fs.existsSync(vitestPath);
console.log(`   vitest: ${vitestExists ? '✅ installed' : '❌ NOT FOUND'}`);

if (vitestExists) {
  try {
    const vitestPkg = require(path.join(vitestPath, 'package.json'));
    console.log(`   vitest version: ${vitestPkg.version}`);
  } catch (e) {
    console.log('   ⚠️  Could not read vitest version');
  }
}

console.log('');

// Check vitest config
console.log('3️⃣ Configuration:');
const configPath = path.join(process.cwd(), 'vitest.config.ts');
if (fs.existsSync(configPath)) {
  console.log('   ✅ vitest.config.ts exists');
  const configContent = fs.readFileSync(configPath, 'utf8');
  if (configContent.includes('jsdom')) {
    console.log('   ✅ environment: jsdom found in config');
  } else {
    console.log('   ❌ environment: jsdom NOT found in config');
  }
  if (configContent.includes('./test/setup.ts')) {
    console.log('   ✅ setupFiles points to ./test/setup.ts');
  } else {
    console.log('   ⚠️  setupFiles path might be wrong');
  }
} else {
  console.log('   ❌ vitest.config.ts not found');
}

// Check setup file
const setupPath = path.join(process.cwd(), 'test', 'setup.ts');
if (fs.existsSync(setupPath)) {
  console.log('   ✅ test/setup.ts exists');
} else {
  console.log('   ❌ test/setup.ts not found');
}

console.log('');

// Try to load jsdom
console.log('4️⃣ Attempting to load jsdom:');
try {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  console.log('   ✅ jsdom loads successfully');
  console.log(`   ✅ document exists: ${!!dom.window.document}`);
} catch (e) {
  console.log('   ❌ Failed to load jsdom:');
  console.log(`   ${e.message}`);
}

console.log('');
console.log('─────────────────────────────────────');
console.log('');

if (!jsdomExists) {
  console.log('🔧 FIX: Run these commands:');
  console.log('   rm -rf node_modules package-lock.json');
  console.log('   npm install');
} else {
  console.log('💡 If tests still fail, try:');
  console.log('   npm test');
  console.log('');
  console.log('   If you see "document is not defined", run:');
  console.log('   rm -rf node_modules package-lock.json');
  console.log('   npm cache clean --force');
  console.log('   npm install');
}

console.log('');
