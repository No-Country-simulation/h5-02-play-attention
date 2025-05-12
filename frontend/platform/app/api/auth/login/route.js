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

    // Obtener texto de respuesta para analizar manualmente
    const responseText = await backendResponse.text();

    // Intentar parsear la respuesta como JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error al parsear respuesta JSON:', parseError);
      console.error('Texto de respuesta recibido:', responseText);
      return NextResponse.json(
        {
          error:
            'Error al procesar la respuesta del servidor. Por favor, intenta nuevamente.'
        },
        { status: 500 }
      );
    }

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
        {
          error:
            'Las credenciales ingresadas no son válidas. Por favor, verifica tu email y contraseña.'
        },
        { status: 401 }
      );
    }

    // Configurar cookie store
    const cookieStore = cookies();

    // Establecer cookie con el token
    cookieStore.set('auth_token_user', token, {
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
        {
          error:
            'Ha ocurrido un error durante el inicio de sesión. Por favor, intenta nuevamente.'
        },
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

      // Obtener texto de respuesta y parsear con manejo de errores
      let userData;
      try {
        const userResponseText = await userResponse.text();
        userData = JSON.parse(userResponseText);
      } catch (parseError) {
        console.error('Error al parsear respuesta de usuario:', parseError);
        throw new Error('Error al procesar los datos de usuario');
      }

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
