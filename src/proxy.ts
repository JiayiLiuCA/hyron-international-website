import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Redirects locale-less paths (`/`, `/about`, …) to `/en/…` or `/zh/…` based on
// the NEXT_LOCALE cookie, then Accept-Language (zh* → zh, everything else → en).
export default createMiddleware(routing);

export const config = {
  // Skip Next internals, Vercel internals and any path with a file extension.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
