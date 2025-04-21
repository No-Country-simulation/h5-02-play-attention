/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración mejorada para el manejo de páginas de error
  // Habilitar páginas explícitas como /404
  trailingSlash: false,
  swcMinify: false,
  experimental: {
    // Permitir rutas explícitas
    typedRoutes: true
  }
};

export default nextConfig;
