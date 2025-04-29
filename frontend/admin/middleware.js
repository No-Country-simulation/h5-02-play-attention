import { NextResponse } from 'next/server';

/**
 * Middleware para manejar autorización basada en roles
 * - admin: acceso total
 * - comercial: solo acceso a CRM
 */
export async function middleware(request) {
  // Obtener token y datos de usuario de las cookies
  const authToken =
    request.cookies.get('auth_token')?.value ||
    request.cookies.get('playAttentionToken')?.value;

  const userInfoCookie = request.cookies.get('user_info')?.value;
  let userRole = 'user';

  // Comprobar si la ruta es pública
  const isPublicRoute =
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/api');

  // Si es ruta pública, continuar normalmente
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Si no hay token, redirigir a login con URL de callback
  if (!authToken) {
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, request.url)
    );
  }

  // Intentar obtener el rol del usuario desde la cookie
  if (userInfoCookie) {
    try {
      const userInfo = JSON.parse(userInfoCookie);
      userRole = userInfo.role || 'user';
    } catch (error) {
      console.error('Error parseando cookie de usuario:', error);
    }
  }

  // Comprobar reglas de acceso basadas en rol
  // 1. El admin tiene acceso a todo
  if (userRole === 'admin') {
    return NextResponse.next();
  }

  // 2. El rol comercial solo tiene acceso a CRM
  if (userRole === 'comercial') {
    const isCrmRoute = request.nextUrl.pathname.startsWith('/crm');
    const isDashboardRoute = request.nextUrl.pathname === '/dashboard';
    const isProfileRoute = request.nextUrl.pathname.startsWith('/profile');

    // Permitir acceso a CRM, Dashboard y Perfil
    if (isCrmRoute || isDashboardRoute || isProfileRoute) {
      return NextResponse.next();
    }

    // Redirigir a CRM para cualquier otra ruta
    return NextResponse.redirect(new URL('/crm', request.url));
  }

  // 3. Otros roles - implementación básica que puede expandirse
  // Por defecto, acceso al dashboard pero no a áreas restringidas
  const restrictedAreas = [
    '/users',
    '/settings',
    '/tickets/manage',
    '/content/manage'
  ];

  const isRestrictedRoute = restrictedAreas.some(area =>
    request.nextUrl.pathname.startsWith(area)
  );

  if (isRestrictedRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Continuar con la solicitud
  return NextResponse.next();
}

// Aplicar middleware solo a rutas específicas
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
