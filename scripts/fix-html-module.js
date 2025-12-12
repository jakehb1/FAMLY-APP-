#!/usr/bin/env node
/**
 * Post-build script to fix HTML module type for Vercel deployment
 * Adds type="module" to script tags that use import.meta
 */
const fs = require('fs');
const path = require('path');

// Try multiple possible paths for dist directory
const possiblePaths = [
  path.join(__dirname, '..', 'dist', 'index.html'),
  path.join(process.cwd(), 'dist', 'index.html'),
  './dist/index.html',
];

let distPath = null;
for (const testPath of possiblePaths) {
  const resolvedPath = path.resolve(testPath);
  if (fs.existsSync(resolvedPath)) {
    distPath = resolvedPath;
    break;
  }
}

// #region agent log
console.log('[DEBUG fix-html-module] Script started');
console.log('[DEBUG fix-html-module] Current working directory:', process.cwd());
console.log('[DEBUG fix-html-module] __dirname:', __dirname);
console.log('[DEBUG fix-html-module] Testing paths:', possiblePaths);
const logData = {location:'fix-html-module.js:20',message:'fix-html-module script started',data:{cwd:process.cwd(),__dirname,possiblePaths,distPath,exists:distPath ? fs.existsSync(distPath) : false},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
try {
  fs.appendFileSync('/Users/jakehbradley/FAMLY APP /.cursor/debug.log', JSON.stringify(logData) + '\n');
} catch (e) {
  // Ignore log file errors in production
}
// #endregion

if (!distPath) {
  // #region agent log
  console.error('[DEBUG fix-html-module] dist/index.html not found in any path');
  const errorLog = {location:'fix-html-module.js:30',message:'dist/index.html not found',data:{possiblePaths,checked:possiblePaths.map(p => ({path:p,exists:fs.existsSync(path.resolve(p))}))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
  try {
    fs.appendFileSync('/Users/jakehbradley/FAMLY APP /.cursor/debug.log', JSON.stringify(errorLog) + '\n');
  } catch (e) {}
  // #endregion
  console.error('[ERROR] dist/index.html not found in any of these paths:', possiblePaths);
  console.error('[ERROR] Current directory contents:', fs.readdirSync(process.cwd()));
  process.exit(1);
}

console.log('[DEBUG fix-html-module] Found index.html at:', distPath);

let html = fs.readFileSync(distPath, 'utf8');
// #region agent log
const beforeLog = {location:'fix-html-module.js:17',message:'HTML read before fix',data:{htmlLength:html.length,hasTypeModule:html.includes('type="module"')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
fs.appendFileSync('/Users/jakehbradley/FAMLY APP /.cursor/debug.log', JSON.stringify(beforeLog) + '\n');
// #endregion

// Add type="module" to script tags that reference _expo/static/js/web
const beforeReplace = html;
html = html.replace(
  /<script src="\/_expo\/static\/js\/web\/([^"]+)"([^>]*)><\/script>/g,
  '<script type="module" src="/_expo/static/js/web/$1"$2></script>'
);
// #region agent log
const afterLog = {location:'fix-html-module.js:22',message:'HTML after replace',data:{htmlLength:html.length,hasTypeModule:html.includes('type="module"'),wasChanged:beforeReplace !== html},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
fs.appendFileSync('/Users/jakehbradley/FAMLY APP /.cursor/debug.log', JSON.stringify(afterLog) + '\n');
// #endregion

fs.writeFileSync(distPath, html, 'utf8');
// #region agent log
const successLog = {location:'fix-html-module.js:28',message:'HTML file written successfully',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
fs.appendFileSync('/Users/jakehbradley/FAMLY APP /.cursor/debug.log', JSON.stringify(successLog) + '\n');
// #endregion
console.log('✅ Fixed HTML module type for script tags');

