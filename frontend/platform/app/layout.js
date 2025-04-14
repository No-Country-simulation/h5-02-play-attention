import '../app/[locale]/globals.css';

/**
 * Layout global que solo importa los estilos CSS
 * Permite que la página not-found.js tenga acceso a los estilos de Tailwind
 * sin interferir con el RootLayout principal en [locale]/layout.js
 */
export default function GlobalStylesLayout({ children }) {
  return children;
}
