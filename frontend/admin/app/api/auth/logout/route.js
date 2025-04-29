import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Endpoint para cerrar sesión
 * Elimina todas las cookies relacionadas con la autenticación
 */
export async function POST() {
  const cookieStore = cookies();

  // Eliminar todas las cookies de autenticación
  cookieStore.delete('auth_token');
  cookieStore.delete('playAttentionToken');
  cookieStore.delete('user_info');

  return NextResponse.json({
    success: true,
    message: 'Sesión cerrada correctamente'
  });
}
