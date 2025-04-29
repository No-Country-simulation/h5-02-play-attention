import { Roboto } from 'next/font/google';
import './globals.css';
import Sidebar from '@/shared/layout/sidebar/sidebar';
import { Toaster } from '@/shared/ui/toast';
import { QueryProvider } from '@/shared/lib/providers';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap'
});

export const metadata = {
  title: 'Play Attention | Panel de Administración',
  description:
    'Panel administrativo y CRM para la gestión de contenidos, usuarios y soporte de Play Attention',
  icons: {
    icon: '/img/logospinner.png',
    apple: '/img/logospinner.png',
    shortcut: '/img/logospinner.png'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1
  },
  themeColor: '#6f42c1'
};

// Definimos las páginas que no requieren autenticación
const publicPages = ['/login', '/register', '/forgot-password'];

export default function RootLayout({ children }) {
  return (
    <html lang='es'>
      <body className={`${roboto.variable} font-sans antialiased`}>
        <QueryProvider>
          <div className='flex min-h-screen flex-col md:flex-row'>
            <Sidebar />
            <main className='flex-1 overflow-auto px-4 pt-16 md:pt-6 pb-6 relative'>
              {children}
            </main>
          </div>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
