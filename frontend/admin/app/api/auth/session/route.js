import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_ENDPOINTS } from '@/shared/lib/api/config';

/**
 * Endpoint para obtener la sesión actual
 * Verifica que el token sea válido y devuelve la información del usuario
 */
export async function GET() {
  const cookieStore = cookies();

  // Obtener el token de la cookie
  const token =
    cookieStore.get('auth_token')?.value ||
    cookieStore.get('playAttentionToken')?.value;

  if (!token) {
    return NextResponse.json(
      {
        authenticated: false,
        message: 'No hay sesión activa'
      },
      { status: 401 }
    );
  }

  try {
    // Llamar al endpoint del backend para verificar el token
    const response = await fetch(`${API_ENDPOINTS.auth.profile}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // Si el token no es válido, eliminar las cookies
      cookieStore.delete('auth_token');
      cookieStore.delete('playAttentionToken');
      cookieStore.delete('user_info');

      return NextResponse.json(
        {
          authenticated: false,
          message: 'Sesión inválida o expirada'
        },
        { status: 401 }
      );
    }

    const userData = await response.json();

    // Actualizar la cookie de user_info con los datos más recientes
    const userInfo = {
      id: userData.id || userData._id,
      name: userData.name || userData.fullname,
      email: userData.email,
      role: userData.role || 'user'
    };

    cookieStore.set('user_info', JSON.stringify(userInfo), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    });

    return NextResponse.json({
      authenticated: true,
      user: userInfo
    });
  } catch (error) {
    console.error('Error verificando sesión:', error);

    return NextResponse.json(
      {
        authenticated: false,
        message: 'Error al verificar sesión'
      },
      { status: 500 }
    );
  }
}
