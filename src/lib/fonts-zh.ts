import localFont from 'next/font/local';

// Chinese headline face: Noto Serif SC 600, subset to the characters the site
// uses (scripts/subset-zh-font.mjs). Not preloaded — /en pages never need it.
// Chinese body text uses the system CJK sans stack (see globals.css).
export const notoSerifSC = localFont({
  src: '../fonts/noto-serif-sc-600.woff2',
  weight: '600',
  style: 'normal',
  display: 'swap',
  preload: false,
  variable: '--font-noto-serif-sc',
  fallback: ['Noto Serif CJK SC', 'Source Han Serif SC', 'Songti SC', 'STSong', 'serif'],
});
