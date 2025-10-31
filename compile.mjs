#!/usr/bin/env node
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load and execute TypeScript compiler
try {
  require('typescript/bin/tsc');
} catch (error) {
  console.error('Failed to compile:', error);
  process.exit(1);
}
