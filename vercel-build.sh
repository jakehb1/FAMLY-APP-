#!/bin/bash
set -e

echo "[DEBUG] Starting Vercel build script"
echo "[DEBUG] Current directory: $(pwd)"
echo "[DEBUG] Running: npx expo export --platform web"

# Run Expo export
npx expo export --platform web

echo "[DEBUG] Expo export completed"
echo "[DEBUG] Checking if dist/index.html exists..."
if [ -f "dist/index.html" ]; then
  echo "[DEBUG] dist/index.html found, running fix script"
  node scripts/fix-html-module.js
else
  echo "[ERROR] dist/index.html not found after export"
  ls -la dist/ || echo "dist directory doesn't exist"
  exit 1
fi

echo "[DEBUG] Build script completed successfully"

