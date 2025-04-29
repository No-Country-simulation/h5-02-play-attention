import { NextResponse } from 'next/server';

/**
 * Middleware para proteger rutas que requieren autenticación
 * Se ejecuta antes de que se carguen las páginas
 */
export function middleware(request) {
  // Obtener la cookie de autenticación
  const authCookie = request.cookies.get('auth_token');
  const userInfoCookie = request.cookies.get('user_info');

  // Ruta actual
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login', '/register', '/forgot-password'];

  // Si es una ruta pública, no hacer nada
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Si no hay token de autenticación, redirigir a login
  if (!authCookie || !userInfoCookie) {
    const url = new URL('/login', request.url);
    // Añadir la URL original como parámetro para redirigir después del login
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Si hay token, permitir acceso
  return NextResponse.next();
}

/**
 * Configurar las rutas en las que se aplicará el middleware
 */
export const config = {
  // Aplicar a todas las rutas excepto a los archivos estáticos, API, etc.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth|images|.*\\.png$).*)'
  ]
};
