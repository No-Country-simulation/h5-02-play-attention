'use client';

import LoginForm from './components/LoginForm';
import { Card } from '@/shared/ui/card';

export default function Login() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 to-purple-900 p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-white mb-2'>Play Attention</h1>
          <p className='text-purple-200'>Panel de Administración</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
