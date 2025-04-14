import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import './globals.css';
import { getMessages } from 'next-intl/server';
import Sidebar from '@/shared/layout/sidebar/sidebar';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata = {
  title: 'Play Attention',
  description:
    'Cognitive training platform for improving attention and executive functions'
};

// Define pages that don't require authentication
const publicPages = ['/login', '/register', '/forgot-password'];

export default async function RootLayout({ children, params }) {
  const locale = params.locale;

  // Check if locale is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });
  // Extrae el nombre de la aplicación para los metadatos
  const appName = messages.common.appName || 'Play Attention';

  // Actualiza los metadatos dinámicamente
  metadata.title = appName;

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className='flex h-screen'>
            <Sidebar />
            <main className='flex-1 overflow-auto'>{children}</main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
