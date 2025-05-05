import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_ENDPOINTS } from '@/shared/lib/api/config';

/**
 * Endpoint para obtener la sesión actual del usuario
 * Utiliza las cookies de autenticación para verificar el estado de sesión
 */
export async function GET() {
  try {
    // Obtener las cookies
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    const userInfoCookie = cookieStore.get('user_info')?.value;

    // Si no hay token, no hay sesión
    if (!token) {
      return NextResponse.json(
        { isAuthenticated: false, user: null },
        { status: 200 }
      );
    }

    // Si tenemos la cookie de user_info, usamos esa información
    if (userInfoCookie) {
      try {
        const userInfo = JSON.parse(userInfoCookie);
        return NextResponse.json(
          {
            isAuthenticated: true,
            user: userInfo
          },
          { status: 200 }
        );
      } catch (error) {
        console.error('Error al parsear cookie de usuario:', error);
        // Si hay error al parsear, continuamos con el flujo normal
      }
    }

    // Si no tenemos la cookie o hubo error, decodificamos el token para obtener el ID
    let userId;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
      userId = decoded.user;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return NextResponse.json(
        { isAuthenticated: false, user: null },
        { status: 200 }
      );
    }

    // Obtener datos del usuario desde el backend
    const response = await fetch(API_ENDPOINTS.users.getById(userId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    // Si no se puede obtener los datos del usuario, la sesión no es válida
    if (!response.ok) {
      return NextResponse.json(
        { isAuthenticated: false, user: null },
        { status: 200 }
      );
    }

    // Extraer datos del usuario
    const userData = await response.json();

    // Preparar datos de usuario
    const userInfo = {
      id: userData.id || userData._id,
      email: userData.email,
      name: userData.name || userData.fullname || '',
      role: userData.role || 'user'
    };

    // Actualizar la cookie con la información más reciente
    cookieStore.set('user_info', JSON.stringify(userInfo), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    });

    // Devolver datos de sesión
    return NextResponse.json(
      {
        isAuthenticated: true,
        user: userInfo
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener la sesión:', error);
    return NextResponse.json(
      {
        isAuthenticated: false,
        user: null,
        error: 'Error al verificar sesión'
      },
      { status: 500 }
    );
  }
}
