import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_ENDPOINTS } from '@/shared/lib/api/config';

/**
 * Endpoint de login que actúa como proxy al backend y maneja cookies
 * Esta función recibe las credenciales del cliente, las envía al backend real,
 * y establece cookies seguras con la respuesta
 */
export async function POST(request) {
  try {
    // Extraer credenciales del body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Llamar al backend real
    const backendResponse = await fetch(API_ENDPOINTS.auth.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    // Obtener datos de respuesta
    const data = await backendResponse.json();

    // Si la respuesta no es exitosa, devolver el error
    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Error de autenticación' },
        { status: backendResponse.status }
      );
    }

    // Extraer token (puede venir como token o playAttentionToken)
    const token = data.token || data.playAttentionToken;

    if (!token) {
      console.error('Respuesta sin token:', data);
      return NextResponse.json(
        { error: 'No se recibió token de autenticación' },
        { status: 500 }
      );
    }

    // Configurar cookie store
    const cookieStore = cookies();

    // Establecer cookie con el token
    cookieStore.set('auth_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    });

    // Si hay un playAttentionToken específico, también guardarlo
    if (data.playAttentionToken && data.playAttentionToken !== token) {
      cookieStore.set('playAttentionToken', data.playAttentionToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 días
      });
    }

    // Decodificar el token para obtener información del usuario
    let userId;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
      userId = decoded.user;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return NextResponse.json(
        { error: 'Error al procesar token de autenticación' },
        { status: 500 }
      );
    }

    // Obtener datos completos del usuario usando el endpoint getById
    try {
      const userResponse = await fetch(API_ENDPOINTS.users.getById(userId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Error al obtener datos de usuario');
      }

      const userData = await userResponse.json();

      // Preparar datos de usuario para la cookie
      const userInfo = {
        id: userData.id || userData._id,
        email: userData.email,
        name: userData.name || userData.fullname || '',
        role: userData.role || 'user'
      };

      // Establecer cookie con información del usuario para acceso en el cliente
      cookieStore.set('user_info', JSON.stringify(userInfo), {
        httpOnly: false, // Esta cookie es accesible desde JavaScript
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 días
      });

      // Devolver respuesta exitosa con los datos del usuario
      return NextResponse.json({
        success: true,
        user: userInfo
      });
    } catch (error) {
      console.error('Error al obtener datos de usuario:', error);
      // Aunque hubo error al obtener los datos completos, el login fue exitoso
      // Devolver información básica del usuario
      const userInfo = {
        id: userId,
        email: email
      };

      cookieStore.set('user_info', JSON.stringify(userInfo), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 días
      });

      return NextResponse.json({
        success: true,
        user: userInfo,
        warning:
          'Autenticación exitosa pero no se pudieron obtener todos los datos del usuario'
      });
    }
  } catch (error) {
    console.error('Error en API de login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
