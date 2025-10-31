#!/bin/bash
set -e

echo "=== Starting Vercel Build ==="
echo "Current directory: $(pwd)"

echo ""
echo "=== Running prisma generate ==="
npx prisma generate

echo ""
echo "=== Running TypeScript compilation ==="
node_modules/.bin/tsc

echo ""
echo "=== Build completed successfully ==="
