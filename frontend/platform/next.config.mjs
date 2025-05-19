/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración mejorada para el manejo de páginas de error
  // Habilitar páginas explícitas como /404
  trailingSlash: false,
  experimental: {
    // Permitir rutas explícitas
    typedRoutes: true
  },
  // Asegurar que los assets estáticos se manejen correctamente
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  // Permitir que se sirvan los archivos estáticos desde la raíz
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
