import { NextResponse } from 'next/server';

/**
 * Middleware para proteger rutas que requieren autenticación
 * y restringir acceso según rol del usuario
 * Se ejecuta antes de que se carguen las páginas
 */
export function middleware(request) {
  // Obtener la cookie de autenticación
  const authCookie = request.cookies.get('auth_token_user');
  const userInfoCookie = request.cookies.get('user_info');

  // Ruta actual
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicPaths = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password'
  ];

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

  // Verificar el rol del usuario para restricción de acceso
  try {
    const userInfo = JSON.parse(userInfoCookie.value);
    const userRole = userInfo?.role;

    // Si el usuario es Comercial, solo permitir acceso a /crm
    if (userRole === 'Comercial') {
      // Si intenta acceder a una ruta diferente de /crm, redirigir a /crm
      if (!pathname.startsWith('/crm')) {
        return NextResponse.redirect(new URL('/crm', request.url));
      }
    }
  } catch (error) {
    console.error('Error al verificar rol de usuario:', error);
    // En caso de error al verificar el rol, redirigir a login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si pasa todas las validaciones, permitir acceso
  return NextResponse.next();
}

/**
 * Configurar las rutas en las que se aplicará el middleware
 */
export const config = {
  // Aplicar a todas las rutas excepto a los archivos estáticos, API, etc.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth|api/reset-password|images|svgs|.*\\.png$|.*\\.svg$).*)'
  ]
};
