#!/usr/bin/env node
/**
 * Regenerates ../brief/content-zh.md — a side-by-side English / Chinese table
 * of every string in messages/*.json, for client review of the Chinese copy.
 * Run `npm run copy:review` after editing either messages file.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const en = JSON.parse(readFileSync(join(root, 'messages/en.json'), 'utf8'));
const zh = JSON.parse(readFileSync(join(root, 'messages/zh.json'), 'utf8'));
const outFile = join(root, '..', 'brief', 'content-zh.md');

const SECTIONS = [
  ['Nav', '导航'],
  ['Cta', '通用按钮'],
  ['Footer', '页脚'],
  ['Home', '首页'],
  ['ClosingCta', '页面结尾的预约区块（首页、关于、服务、合作方式共用）'],
  ['About', '关于我们'],
  ['Services', '服务'],
  ['HowWeWork', '合作方式'],
  ['Contact', '联系我们'],
  ['Legal', '免责声明与隐私说明'],
  ['NotFound', '找不到页面（404）'],
  ['Meta', '搜索引擎和社交分享里显示的标题与描述'],
  ['Images', '图片说明（读屏软件朗读、图片加载失败时显示）'],
];

// Screen-reader-only and anti-spam strings the client does not need to review.
const SKIP = new Set(['Nav.skip', 'Nav.openMenu', 'Nav.closeMenu', 'Nav.primary', 'Nav.language', 'Nav.homeLink', 'Contact.form.honeypot', 'Services.navLabel']);

const LABELS = {
  title: '标题', titleLines: '大标题', body: '正文', lead: '导语', eyebrow: '小标题', subhead: '副标题',
  list: '列表', listTitle: '列表标题', items: '条目', paragraphs: '段落', steps: '步骤', outcome: '成果',
  note: '说明框', noteLabel: '说明框标签', mandates: '常见委托内容', mandatesLabel: '列表标签',
  outcomeLabel: '成果标签', short: '目录短名', hero: '主视觉', intro: '重大决策', capabilities: '核心能力',
  why: '为什么选择', process: '流程预告', link: '链接', approach: '我们的方法', serve: '服务对象',
  principles: '原则', formats: '合作形式', closing: '结语', details: '联系方式', form: '表单',
  errors: '填写错误提示', disclaimer: '免责声明', privacy: '隐私说明', description: '描述',
  strategicAdvisory: '01', financingReadiness: '02', transactions: '03', realEstate: '04', operations: '05',
  professionalCoordination: '06', home: '首页', about: '关于', services: '服务', howWeWork: '合作方式',
  contact: '联系', legal: '免责声明页', notFound: '404', scroll: '向下滚动提示', formTitle: '表单标题',
  cta: '页头按钮', bookConfidential: '预约按钮（长）', explore: '服务按钮', start: '沟通按钮',
  tagline: '标语', navHeading: '导航栏目名', contactHeading: '联系栏目名', readDisclaimer: '免责声明链接',
  copyright: '版权行', siteName: '网站名', ogAlt: '分享图说明', name: '姓名', company: '公司',
  email: '邮箱', phone: '电话', message: '咨询内容', optional: '选填标记', submit: '提交按钮',
  submitting: '提交中', notice: '表单下方提示', success: '提交成功', error: '提交失败', invalid: '填写有误',
  tooLong: '内容过长', office: '地址', hours: '营业时间', byAppointment: '预约说明', map: '地图链接',
  back: '返回按钮', bridge: '斜拉桥', goldenGate: '悬索桥', mountain: '山峰', speedboat: '快艇', tree: '大树',
};

const label = (path) =>
  path.map((p) => (typeof p === 'number' ? String(p + 1) : (LABELS[p] ?? p))).join(' › ');
const cell = (s) => String(s).replaceAll('|', '\\|').replaceAll('\n', ' ');

function walk(e, z, path, rows) {
  if (Array.isArray(e)) {
    if (path.at(-1) === 'titleLines') rows.push([path, e.join(' '), z.join('')]);
    else e.forEach((item, i) => walk(item, z[i], [...path, i], rows));
  } else if (e && typeof e === 'object') {
    for (const k of Object.keys(e)) walk(e[k], z[k], [...path, k], rows);
  } else {
    rows.push([path, e, z]);
  }
}

const md = [
  '# HYRON 网站中文稿（中英对照，供客户审阅）',
  '',
  '> 这份文件列出网站上每一处文字的英文和中文。中文按 `BRIEF.md` 第 5 节的术语表重新撰写，没有使用旧网站、宣传册、易拉宝里的任何句子。',
  '> 本文件由 `site/messages/en.json` 和 `site/messages/zh.json` 自动生成（`npm run copy:review`）。改文案请改那两个文件，再重新生成本文件。',
  '> 电话、邮箱、地址、营业时间不在这里，统一放在 `site/src/config/site.ts`，以客户确认的为准。',
  '> `{email}`、`{year}` 这类花括号是网站自动填入的内容；`<link>…</link>` 表示这段文字是可点击的链接。',
  '',
  '## 请客户重点确认',
  '',
  '1. 用词是否符合公司的说法，特别是服务名称（战略咨询、融资准备、资本方、交易支持、落地执行等）。',
  '2. 免责声明（页脚、服务 02 和 06 的说明框、免责声明页）请律师和英文版一起审阅。',
  '3. 中文里的「投资」「金融」「监管」「保证」只出现在「投资者」「重大投资」和「我们不提供……」这类说法里，没有用来描述海润国际自己的业务。',
  '',
];

for (const [ns, title] of SECTIONS) {
  const rows = [];
  walk(en[ns], zh[ns], [], rows);
  md.push(`## ${title}`, '', '| 位置 | English | 中文 |', '|---|---|---|');
  for (const [path, e, z] of rows) {
    if (SKIP.has([ns, ...path].join('.'))) continue;
    md.push(`| ${cell(label(path))} | ${cell(e)} | ${cell(z)} |`);
  }
  md.push('');
}

writeFileSync(outFile, md.join('\n'));
console.log(`✓ wrote ${outFile}`);
