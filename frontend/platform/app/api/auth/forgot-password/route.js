import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/shared/lib/api/config';

/**
 * Endpoint para solicitar recuperación de contraseña
 * Esta función recibe el email del cliente, lo envía al backend real,
 * y devuelve la respuesta del backend
 */
export async function POST(request) {
  try {
    // Extraer email del body
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      );
    }

    // Llamar al backend real
    const backendResponse = await fetch(API_ENDPOINTS.auth.forgotPassword, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    // Obtener datos de respuesta
    const data = await backendResponse.json();

    // Si la respuesta no es exitosa, devolver el error
    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          error: data.message || 'Error al solicitar recuperación de contraseña'
        },
        { status: backendResponse.status }
      );
    }

    // Devolver respuesta exitosa
    return NextResponse.json({
      success: true,
      message:
        data.message || 'Instrucciones de recuperación enviadas al correo'
    });
  } catch (error) {
    console.error('Error en API de recuperación de contraseña:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
