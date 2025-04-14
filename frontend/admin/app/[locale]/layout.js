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
  title: 'Admin Panel',
  description: 'Administration dashboard'
};

// Definimos las páginas que no requieren autenticación
const publicPages = ['/login', '/register', '/forgot-password'];

export default async function RootLayout({ children, params }) {
  const locale = params.locale;

  // Verificar si el locale es válido
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

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
