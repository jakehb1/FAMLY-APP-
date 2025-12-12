#!/usr/bin/env node
/**
 * Post-build script that runs after Vercel's auto-build
 * This is called via package.json "vercel-build" script
 */
const fs = require('fs');
const path = require('path');

console.log('[DEBUG post-build-fix] Script started');
console.log('[DEBUG post-build-fix] Current directory:', process.cwd());

// Try multiple possible paths for dist directory
const possiblePaths = [
  path.join(process.cwd(), 'dist', 'index.html'),
  path.join(__dirname, '..', 'dist', 'index.html'),
  './dist/index.html',
];

let distPath = null;
for (const testPath of possiblePaths) {
  const resolvedPath = path.resolve(testPath);
  console.log('[DEBUG post-build-fix] Checking path:', resolvedPath);
  if (fs.existsSync(resolvedPath)) {
    distPath = resolvedPath;
    console.log('[DEBUG post-build-fix] Found index.html at:', distPath);
    break;
  }
}

if (!distPath) {
  console.error('[ERROR] dist/index.html not found in any path');
  console.error('[ERROR] Checked paths:', possiblePaths);
  try {
    const dirContents = fs.readdirSync(process.cwd());
    console.error('[ERROR] Current directory contents:', dirContents);
    if (fs.existsSync('dist')) {
      console.error('[ERROR] dist directory contents:', fs.readdirSync('dist'));
    }
  } catch (e) {
    console.error('[ERROR] Could not read directory:', e.message);
  }
  process.exit(1);
}

let html = fs.readFileSync(distPath, 'utf8');
console.log('[DEBUG post-build-fix] HTML read, length:', html.length);
console.log('[DEBUG post-build-fix] Has type="module":', html.includes('type="module"'));

// Add type="module" to script tags that reference _expo/static/js/web
const beforeReplace = html;
html = html.replace(
  /<script src="\/_expo\/static\/js\/web\/([^"]+)"([^>]*)><\/script>/g,
  '<script type="module" src="/_expo/static/js/web/$1"$2></script>'
);

const wasChanged = beforeReplace !== html;
console.log('[DEBUG post-build-fix] HTML modified:', wasChanged);
console.log('[DEBUG post-build-fix] Has type="module" after fix:', html.includes('type="module"'));

if (wasChanged) {
  fs.writeFileSync(distPath, html, 'utf8');
  console.log('✅ Fixed HTML module type for script tags');
} else {
  console.log('ℹ️  HTML already has type="module" or no script tags found');
}

