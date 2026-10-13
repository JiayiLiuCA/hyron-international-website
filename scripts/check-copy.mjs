#!/usr/bin/env node
/**
 * Compliance copy check (brief/BRIEF.md §1.6).
 *
 * Tier 1 terms must never appear on the site → any hit exits with code 1, which
 * fails `npm run build` (via `prebuild`) locally and on Vercel.
 * Tier 2 terms may only describe third parties or appear in negative
 * disclaimers → printed as a warning summary for manual review.
 *
 * Scope:
 *   - messages/**\/*.json and src/**\/*.{ts,tsx,md,mdx}
 *   - Extra files can be passed as CLI args, e.g. `node scripts/check-copy.mjs ../brief/content-zh.md`
 *   - `brief/` is never scanned by default (it quotes the old copy as counter-examples).
 *   - This script is the word list, and scripts/ is outside the scan scope.
 *
 * English terms use word-boundary, case-insensitive regexes; Chinese terms use
 * substring matching. Terms marked `copyOnly` are only checked in copy files
 * (messages/*.json and extra CLI files) because they legitimately occur in code
 * (`mask-size: 100% 100%`, `Intl.NumberFormat({ currency })`, …). If a false
 * positive shows up, narrow the scope of that one term — do not relax the check.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** @typedef {{ label: string, re: RegExp, copyOnly?: boolean }} Term */

/** @param {string} source @param {object} [opts] @returns {Term} */
const en = (source, opts = {}) => ({
  label: source,
  re: new RegExp(`\\b(?:${source})\\b`, 'gi'),
  ...opts,
});

/** @param {string} word @param {object} [opts] @returns {Term} */
const zh = (word, opts = {}) => ({
  label: word,
  re: new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
  ...opts,
});

/** @type {Term[]} */
const TIER1 = [
  // English (§1.2)
  en('FINTRAC'),
  en('MSBs?'),
  en('money[\\s-]+services?'),
  en('remit(?:s|ted|ting|tance|tances)?'),
  en('currenc(?:y|ies)', { copyOnly: true }),
  en('foreign\\s+exchange'),
  en('forex'),
  en('FX', { copyOnly: true }),
  en('exchange\\s+rates?'),
  en('wire\\s+transfers?'),
  en('money\\s+transfers?'),
  en('funds?\\s+transfers?'),
  en('transfer\\s+funds'),
  en('payment\\s+processing'),
  en('payment\\s+services?'),
  en('cash\\s+services?'),
  en('RMB'),
  en('CNY'),
  en('renminbi'),
  en('bank\\s+drafts?'),
  // Chinese (§1.3)
  ...[
    '换汇', '外汇', '汇率', '汇款', '汇兑', '结汇', '购汇', '电汇', '兑换', '外币', '货币',
    '转账', '跨境支付', '跨境汇款', '本票', '人民币', '加币',
    '金融专家', '金融机构', '金融服务机构', '金融服务公司', '金融科技', '金融服务平台',
    '理财', '理财产品', '投资理财', '财富管理', '资产配置',
    '资金安全', '保障资金', '保本',
    '银监会', '特许交易商', '外汇结算',
    '融通世界',
  ].map((w) => zh(w)),
  zh('100%', { copyOnly: true }),
];

/** @type {Term[]} */
const TIER2 = [
  en('lenders?|lending|loans?'),
  en('banks?|banking'),
  en('financial\\s+institutions?'),
  en('investment\\s+dealers?'),
  en('brokers?|brokerage'),
  en('insurance\\s+brokers?'),
  en('wealth\\s+management'),
  en('asset\\s+management'),
  en('asset\\s+allocation'),
  en('licensed|registered|regulated|authorized'),
  en('guarantee[ds]?'),
  en('cross-border'),
  ...[
    '金融', '银行', '贷款', '放贷', '借贷', '牌照', '持牌', '注册', '监管', '认证',
    '保障', '保证', '承诺', '跨境', '资金', '投资', '收益', '安全',
  ].map((w) => zh(w)),
];

const CODE_EXT = new Set(['.ts', '.tsx', '.md', '.mdx']);

/** @param {string} dir @param {(file: string) => boolean} keep @returns {string[]} */
function walk(dir, keep) {
  let out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out = out.concat(walk(p, keep));
    else if (keep(p)) out.push(p);
  }
  return out;
}

const copyFiles = [
  ...walk(join(root, 'messages'), (p) => extname(p) === '.json'),
  ...process.argv.slice(2).map((p) => resolve(process.cwd(), p)),
];
const codeFiles = walk(join(root, 'src'), (p) => CODE_EXT.has(extname(p)));

/** @param {string} file @param {Term[]} terms @param {boolean} isCopy */
function scan(file, terms, isCopy) {
  const hits = [];
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const term of terms) {
      if (term.copyOnly && !isCopy) continue;
      term.re.lastIndex = 0;
      for (const m of line.matchAll(term.re)) {
        hits.push({ file: relative(process.cwd(), file), line: i + 1, word: m[0], term: term.label });
      }
    }
  });
  return hits;
}

const tier1 = [];
const tier2 = [];
for (const f of copyFiles) {
  tier1.push(...scan(f, TIER1, true));
  tier2.push(...scan(f, TIER2, true));
}
for (const f of codeFiles) {
  tier1.push(...scan(f, TIER1, false));
  // Tier 2 is a copy review aid; only the company config holds copy-like text in src/.
  if (f.includes(`${join('src', 'config')}`)) tier2.push(...scan(f, TIER2, false));
}

if (tier2.length) {
  console.warn(`\n⚠ check:copy — ${tier2.length} Tier 2 term(s) to review by hand (third parties / negative disclaimers only):`);
  for (const h of tier2) console.warn(`  ${h.file}:${h.line}: ${h.word}`);
}

if (tier1.length) {
  console.error(`\n✖ check:copy — ${tier1.length} banned Tier 1 term(s) found:`);
  for (const h of tier1) console.error(`  ${h.file}:${h.line}: ${h.word}`);
  console.error('\nRemove these words (brief/BRIEF.md §1). The build is blocked until they are gone.\n');
  process.exit(1);
}

console.log(`✓ check:copy — no Tier 1 terms in ${copyFiles.length} copy file(s) and ${codeFiles.length} source file(s).`);
