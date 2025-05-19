'use client';

import { useState, useEffect } from 'react';
import { ServiceUnavailable } from './ServiceUnavailable';
import { ConnectionError } from './ConnectionError';
import { CorsError } from './CorsError';

/**
 * Componente para manejar errores de aplicación a nivel global
 * Puede utilizarse como wrapper para secciones completas de la aplicación
 *
 * @example
 * <AppErrorHandler>
 *   <YourFeatureComponent />
 * </AppErrorHandler>
 */
export function AppErrorHandler({
  children,
  featureName = 'servicio',
  onRetry,
  homePath = '/dashboard',
  homeText = 'Volver al panel'
}) {
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);

  // Función que detecta si el error es de tipo CORS
  const isCorsError = error => {
    if (!error) return false;

    // Mensajes típicos de errores CORS
    const corsMessages = [
      'Access to fetch',
      'has been blocked by CORS policy',
      'CORS policy',
      'origin not allowed',
      'cross-origin request',
      'credentials mode',
      'Access-Control-Allow-Origin'
    ];

    const errorMessage =
      typeof error === 'string'
        ? error
        : error.message || JSON.stringify(error);

    return corsMessages.some(msg =>
      errorMessage.toLowerCase().includes(msg.toLowerCase())
    );
  };

  // Efecto para detectar cuando la aplicación está offline
  useEffect(() => {
    const handleOnline = () => {
      if (error && errorType === 'connection') {
        setError(null);
        setErrorType(null);
      }
    };

    const handleOffline = () => {
      setError(new Error('La conexión a internet se ha perdido'));
      setErrorType('connection');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error, errorType]);

  // Manejador global de errores
  const handleError = (error, type = null) => {
    // Determinar automáticamente el tipo de error si no se especifica
    let errorType = type;

    if (!errorType) {
      if (isCorsError(error)) {
        errorType = 'cors';
      } else if (!navigator.onLine) {
        errorType = 'connection';
      } else {
        errorType = 'service';
      }
    }

    setError(error);
    setErrorType(errorType);
  };

  // Exponer el manejador de errores a los hijos mediante Context
  useEffect(() => {
    // Hacer el manejador disponible globalmente para debugging
    if (process.env.NODE_ENV === 'development') {
      window.reportAppError = handleError;
    }
  }, []);

  // Función para reintentar
  const handleRetry = () => {
    setError(null);
    setErrorType(null);
    if (onRetry) onRetry();
  };

  // Si hay un error de conexión
  if (errorType === 'connection') {
    return (
      <ConnectionError
        onRetry={handleRetry}
        error={error}
        homePath={homePath}
        homeText={homeText}
      />
    );
  }

  // Si hay un error CORS
  if (errorType === 'cors') {
    return (
      <CorsError
        onRetry={handleRetry}
        error={error}
        homePath={homePath}
        homeText={homeText}
      />
    );
  }

  // Si hay un error de servicio
  if (errorType === 'service') {
    return (
      <ServiceUnavailable
        featureName={featureName}
        onRetry={handleRetry}
        error={error}
        homePath={homePath}
        homeText={homeText}
      />
    );
  }

  // Si no hay errores, renderizar los hijos
  return <>{children}</>;
}
