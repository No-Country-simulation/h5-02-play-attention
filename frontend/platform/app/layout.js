import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/shared/layout/sidebar/sidebar';
import { QueryProvider } from '@/shared/providers';

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

export default function RootLayout({ children }) {
  return (
    <html lang='es'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <div className='flex h-screen'>
            <Sidebar />
            <main className='flex-1 overflow-auto'>{children}</main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
