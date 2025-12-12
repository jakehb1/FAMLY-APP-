#!/usr/bin/env node
/**
 * Post-build script to fix HTML module type for Vercel deployment
 * Adds type="module" to script tags that use import.meta
 */
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist', 'index.html');

if (!fs.existsSync(distPath)) {
  console.error('dist/index.html not found');
  process.exit(1);
}

let html = fs.readFileSync(distPath, 'utf8');

// Add type="module" to script tags that reference _expo/static/js/web
html = html.replace(
  /<script src="\/_expo\/static\/js\/web\/([^"]+)"([^>]*)><\/script>/g,
  '<script type="module" src="/_expo/static/js/web/$1"$2></script>'
);

fs.writeFileSync(distPath, html, 'utf8');
console.log('✅ Fixed HTML module type for script tags');

