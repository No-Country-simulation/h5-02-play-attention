'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className='p-8 flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold mb-6'>Bienvenido</h1>
        <p className='text-gray-600 mb-8'>
          Play Attention - Mantente enfocado, mantente productivo
        </p>
        <Link
          href='/dashboard'
          className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          Explorar
        </Link>
      </div>
    </div>
  );
}
