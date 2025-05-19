/**
 * Obtiene el valor de una cookie por su nombre
 * @param {string} name - Nombre de la cookie a obtener
 * @returns {string|null} Valor de la cookie o null si no existe
 */
export const getCookieValue = name => {
  if (typeof window === 'undefined') {
    return null; // No estamos en el navegador
  }

  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

/**
 * Establece una cookie con los parámetros especificados
 * @param {string} name - Nombre de la cookie
 * @param {string} value - Valor de la cookie
 * @param {number} days - Días de duración (default: 7)
 */
export const setCookie = (name, value, days = 7) => {
  if (typeof window === 'undefined') {
    return; // No estamos en el navegador
  }

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = '; expires=' + date.toUTCString();

  document.cookie =
    name + '=' + encodeURIComponent(value) + expires + '; path=/';
};

/**
 * Elimina una cookie por su nombre
 * @param {string} name - Nombre de la cookie a eliminar
 */
export const deleteCookie = name => {
  if (typeof window === 'undefined') {
    return; // No estamos en el navegador
  }

  setCookie(name, '', -1);
};

/**
 * Comprueba si una cookie existe
 * @param {string} name - Nombre de la cookie a verificar
 * @returns {boolean} True si la cookie existe
 */
export const hasCookie = name => {
  return getCookieValue(name) !== null;
};

/**
 * Obtiene un objeto con todas las cookies disponibles
 * @returns {Object} Objeto con las cookies como {nombre: valor}
 */
export const getAllCookies = () => {
  if (typeof window === 'undefined') {
    return {}; // No estamos en el navegador
  }

  const cookies = {};
  const cookiePairs = document.cookie.split(';');

  for (let i = 0; i < cookiePairs.length; i++) {
    const pair = cookiePairs[i].trim().split('=');
    if (pair[0]) {
      cookies[pair[0]] = decodeURIComponent(pair[1] || '');
    }
  }

  return cookies;
};
