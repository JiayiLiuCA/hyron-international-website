import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Tailwind output is ~11 kB gzip: inlining removes the render-blocking request.
    inlineCss: true,
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Old Squarespace URLs (brief §6.5). next-intl then adds the locale prefix.
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/cart', destination: '/', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
