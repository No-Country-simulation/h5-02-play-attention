import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'es'],

  // Used when no locale matches
  defaultLocale: 'es',

  // The default locale is not prefixed
  localePrefix: 'as-needed',

  // Add pathnames that don't require locales
  // This allows /404 to be handled by our root not-found.js
  alternativeLanguagePath: {
    '/404': false
  }
});

export const config = {
  // Match only internationalized pathnames
  // Include 404 path as a matcher to allow redirection
  matcher: ['/', '/(es|en)/:path*', '/404']
};
