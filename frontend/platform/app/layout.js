import { Roboto } from 'next/font/google';
import './globals.css';
import { QueryProvider, NotificationProvider } from '@/shared/providers';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap'
});

export const metadata = {
  title: 'Play Attention | Plataforma de Usuarios',
  description:
    'Plataforma de Usuarios para la gestión de contenidos, usuarios y soporte de Play Attention',
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
          <NotificationProvider>{children}</NotificationProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
