import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración mejorada para el manejo de páginas de error
  // Habilitar páginas explícitas como /404
  trailingSlash: false,
  experimental: {
    // Permitir rutas explícitas
    typedRoutes: true
  }
};

export default withNextIntl(nextConfig);
