import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/shared/layout/sidebar/sidebar';

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

export default function RootLayout({ children }) {
  return (
    <html lang='es'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className='flex h-screen'>
          <Sidebar />
          <main className='flex-1 overflow-auto'>{children}</main>
        </div>
      </body>
    </html>
  );
}
