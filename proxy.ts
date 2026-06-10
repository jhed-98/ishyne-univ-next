import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    // Match all localized paths
    '/(es|en|pt)/:path*',
    // Enable redirects that add missing locales
    // Exclude internal paths
    '/((?!_next|_vercel|api|favicon\\.ico|images|.*\\..*).*)',
  ],
};
