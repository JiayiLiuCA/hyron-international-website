import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

export const FONT_FILE = 'src/fonts/noto-serif-sc-600.woff2';
export const CHARS_FILE = 'src/fonts/noto-serif-sc-600.chars.txt';

// Always include common CJK punctuation so small copy edits rarely need a rebuild.
const PUNCTUATION = '，。、：；！？「」『』（）《》〈〉【】—…·“”‘’％＋－／';

function walk(dir, exts) {
  let out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out = out.concat(walk(p, exts));
    else if (exts.has(extname(p))) out.push(p);
  }
  return out;
}

/** Every non-ASCII, non-whitespace character in the Chinese copy and in source files. */
export function collectChars(root) {
  const files = [
    join(root, 'messages', 'zh.json'),
    ...walk(join(root, 'src'), new Set(['.ts', '.tsx'])),
  ];
  const set = new Set(PUNCTUATION);
  for (const f of files) {
    for (const ch of readFileSync(f, 'utf8')) {
      if (ch.codePointAt(0) > 0x7f && !/\s/u.test(ch)) set.add(ch);
    }
  }
  return [...set].sort();
}
