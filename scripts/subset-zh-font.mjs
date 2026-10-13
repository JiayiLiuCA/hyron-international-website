#!/usr/bin/env node
/**
 * Builds the self-hosted Chinese headline font: Noto Serif SC instanced at
 * wght 600 and subset to exactly the non-ASCII characters the site uses.
 *
 * Why: next/font/google ships ~100 kB (gzip) of unicode-range @font-face CSS
 * per Noto SC family on *every* page (the root layout is shared by /en and
 * /zh), and Google Fonts is unreachable from mainland China. A single subset
 * woff2 avoids both. Chinese body text uses the visitor's system CJK sans.
 *
 * Run `npm run fonts:zh` after changing Chinese copy. `npm run check:font`
 * (part of prebuild) fails the build if a character is missing.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectChars, CHARS_FILE, FONT_FILE } from './zh-font-chars.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_URL =
  'https://github.com/google/fonts/raw/main/ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf';
const cacheDir = join(root, '.cache', 'fonts');
const sourcePath = join(cacheDir, 'NotoSerifSC-wght.ttf');

if (!existsSync(sourcePath)) {
  mkdirSync(cacheDir, { recursive: true });
  console.log(`Downloading Noto Serif SC (≈25 MB) → ${sourcePath}`);
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${res.statusText}`);
  writeFileSync(sourcePath, Buffer.from(await res.arrayBuffer()));
}

const { default: subsetFont } = await import('subset-font');
const chars = collectChars(root);
const subset = await subsetFont(readFileSync(sourcePath), chars.join(''), {
  targetFormat: 'woff2',
  variationAxes: { wght: 600 },
});

writeFileSync(join(root, FONT_FILE), subset);
writeFileSync(join(root, CHARS_FILE), chars.join('') + '\n');
console.log(`✓ ${FONT_FILE}: ${chars.length} glyphs, ${(subset.length / 1024).toFixed(1)} kB`);
