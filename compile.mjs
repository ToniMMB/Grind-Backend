#!/usr/bin/env node
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  // Execute tsc directly as a child process
  execSync(`node node_modules/typescript/bin/tsc`, {
    cwd: __dirname,
    stdio: 'inherit',
  });
} catch (error) {
  process.exit(1);
}
