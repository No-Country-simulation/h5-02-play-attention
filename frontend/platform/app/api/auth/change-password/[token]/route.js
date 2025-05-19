import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/shared/lib/api/config';

/**
 * Endpoint para cambiar la contraseña utilizando un token
 * Esta función recibe el token como parámetro de ruta y la nueva contraseña en el body
 */
export async function POST(request, { params }) {
  try {
    // Extraer token de los parámetros de ruta
    const { token } = params;

    // Extraer contraseña del body
    const body = await request.json();
    const { password } = body;

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
    const backendResponse = await fetch(API_ENDPOINTS.auth.changePassword, {
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
          error: data.message || 'Error al cambiar la contraseña'
        },
        { status: backendResponse.status }
      );
    }

    // Devolver respuesta exitosa
    return NextResponse.json({
      success: true,
      message: data.message || 'Contraseña cambiada correctamente'
    });
  } catch (error) {
    console.error('Error en API de cambio de contraseña:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
