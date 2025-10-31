#!/usr/bin/env node

// This is an ESM module that loads the CommonJS tsc compiler
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const tsc = require('typescript/lib/tsc.js');

// Just run tsc with no arguments - it will read tsconfig.json
