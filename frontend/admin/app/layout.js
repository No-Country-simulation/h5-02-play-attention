import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/shared/layout/sidebar/sidebar';
import { Toaster } from '@/shared/ui/toast';
import { QueryProvider } from '@/shared/lib/providers';

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
