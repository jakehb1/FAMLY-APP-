#!/usr/bin/env node
/**
 * Post-build script to fix HTML module type for Vercel deployment
 * Adds type="module" to script tags that use import.meta
 */
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist', 'index.html');

// #region agent log
const logData = {location:'fix-html-module.js:9',message:'fix-html-module script started',data:{distPath,exists:fs.existsSync(distPath)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
fs.appendFileSync('/Users/jakehbradley/FAMLY APP /.cursor/debug.log', JSON.stringify(logData) + '\n');
// #endregion

if (!fs.existsSync(distPath)) {
  // #region agent log
  const errorLog = {location:'fix-html-module.js:12',message:'dist/index.html not found',data:{distPath},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
  fs.appendFileSync('/Users/jakehbradley/FAMLY APP /.cursor/debug.log', JSON.stringify(errorLog) + '\n');
  // #endregion
  console.error('dist/index.html not found');
  process.exit(1);
}

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

