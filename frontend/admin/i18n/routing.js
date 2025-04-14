import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'es'],

  // Used when no locale matches
  defaultLocale: 'es',

  // The default locale is not prefixed
  localePrefix: 'as-needed',

  // Specify paths that don't require localization
  // This ensures our custom 404 page works correctly
  alternativeLanguagePath: {
    '/404': false
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
