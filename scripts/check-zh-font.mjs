#!/usr/bin/env node
// Fails the build when Chinese copy uses a character missing from the subset
// headline font (it would otherwise render in a fallback face).
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectChars, CHARS_FILE } from './zh-font-chars.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const have = new Set(readFileSync(join(root, CHARS_FILE), 'utf8').trim());
const missing = collectChars(root).filter((c) => !have.has(c));

if (missing.length) {
  console.error(`\n✖ check:font — ${missing.length} character(s) missing from ${CHARS_FILE}: ${missing.join('')}`);
  console.error('  Run `npm run fonts:zh` to rebuild the Chinese headline font.\n');
  process.exit(1);
}
console.log('✓ check:font — Chinese headline font covers all copy.');
