import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/shared/lib/api/config';

/**
 * Endpoint para restablecer la contraseña
 * Esta función recibe el token y la nueva contraseña del cliente,
 * los envía al backend real y devuelve la respuesta
 */
export async function POST(request) {
  try {
    // Extraer token y contraseña del body
    const body = await request.json();
    const { token, password } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'El token es requerido' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'La nueva contraseña es requerida' },
        { status: 400 }
      );
    }

    // Llamar al backend real
    const backendResponse = await fetch(API_ENDPOINTS.auth.resetPassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, password })
    });

    // Obtener datos de respuesta
    const data = await backendResponse.json();

    // Si la respuesta no es exitosa, devolver el error
    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          error: data.message || 'Error al restablecer la contraseña'
        },
        { status: backendResponse.status }
      );
    }

    // Devolver respuesta exitosa
    return NextResponse.json({
      success: true,
      message: data.message || 'Contraseña restablecida correctamente'
    });
  } catch (error) {
    console.error('Error en API de restablecimiento de contraseña:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
