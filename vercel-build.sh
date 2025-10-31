#!/bin/bash
set -e

echo "=== Starting Vercel Build ==="
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la | head -20

echo ""
echo "=== Running prisma generate ==="
npx prisma generate

echo ""
echo "=== Running TypeScript compilation ==="
cd "$(pwd)"
npx tsc

echo ""
echo "=== Build completed successfully ==="
