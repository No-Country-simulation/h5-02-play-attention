import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Endpoint para cerrar la sesión del usuario
 * Elimina todas las cookies relacionadas con la autenticación
 */
export async function POST() {
  try {
    const cookieStore = cookies();

    // Eliminar todas las cookies relacionadas con la autenticación
    cookieStore.delete('auth_token');
    cookieStore.delete('playAttentionToken');
    cookieStore.delete('user_info');

    return NextResponse.json(
      { success: true, message: 'Sesión cerrada correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return NextResponse.json(
      { success: false, message: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}
