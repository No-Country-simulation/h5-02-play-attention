import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'es'],

  // Used when no locale matches
  defaultLocale: 'es',

  // Use as-needed so default locale doesn't get prefix
  localePrefix: 'as-needed'
});

export const config = {
  // Match all paths except for:
  // - Static files (e.g., /favicon.ico, /images/*)
  // - API routes
  matcher: [
    '/((?!api|_next|_vercel|favicon.ico|robots.txt|.*\\..*).*)' // Skip static files and api
  ]
};
