'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Loader2, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_ENDPOINTS } from '@/shared/lib/api/config';

/**
 * Componente de formulario para restablecer contraseña
 * @returns {JSX.Element} Componente de React
 */
export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Número de dígitos para el token
  const TOKEN_LENGTH = 6;
  const inputRefs = useRef([]);

  const [formData, setFormData] = useState({
    token: '',
    password: '',
    confirmPassword: ''
  });
  const [tokenDigits, setTokenDigits] = useState(Array(TOKEN_LENGTH).fill(''));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [error, setError] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);

  // Verificar si hay un token en la URL
  useEffect(() => {
    if (!searchParams) return;

    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      // Establecer el token y actualizar los dígitos individuales
      setFormData(prev => ({ ...prev, token: tokenFromUrl }));
      fillTokenDigits(tokenFromUrl);
      validateToken(tokenFromUrl);
    }
  }, [searchParams]);

  // Función para llenar los dígitos del token
  const fillTokenDigits = token => {
    if (!token) return;

    const digits = token.split('').slice(0, TOKEN_LENGTH);
    const newDigits = Array(TOKEN_LENGTH).fill('');

    digits.forEach((digit, index) => {
      if (index < TOKEN_LENGTH) {
        newDigits[index] = digit;
      }
    });

    setTokenDigits(newDigits);
  };

  // Función para validar el token
  const validateToken = async token => {
    if (!token || token.length !== TOKEN_LENGTH) return;

    setIsValidatingToken(true);
    setError('');
    setTokenError('');

    try {
      console.log('Validando token:', token);
      console.log('Endpoint:', API_ENDPOINTS.auth.confirmToken);

      const response = await fetch(API_ENDPOINTS.auth.confirmToken, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Token inválido o expirado');
      }

      setTokenValidated(true);
    } catch (err) {
      console.error('Error validando token:', err);
      setTokenError(err.message);
      setTokenValidated(false);
    } finally {
      setIsValidatingToken(false);
    }
  };

  // Manejar evento de pegar en cualquier input de código
  const handlePaste = e => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const cleanedText = pastedText.replace(/\D/g, '').slice(0, TOKEN_LENGTH);

    if (cleanedText) {
      // Llenar todos los campos con los dígitos pegados
      const newDigits = Array(TOKEN_LENGTH).fill('');

      cleanedText.split('').forEach((digit, idx) => {
        if (idx < TOKEN_LENGTH) {
          newDigits[idx] = digit;
        }
      });

      setTokenDigits(newDigits);
      const newToken = newDigits.join('');
      setFormData(prev => ({ ...prev, token: newToken }));

      // Validar automáticamente si el token está completo
      if (newToken.length === TOKEN_LENGTH) {
        validateToken(newToken);
      }

      // Enfocar el siguiente campo si el código no está completo
      if (cleanedText.length < TOKEN_LENGTH) {
        inputRefs.current[cleanedText.length].focus();
      }
    }
  };

  const handleDigitChange = (index, value) => {
    // Permitir solo dígitos
    if (value && !/^\d*$/.test(value)) return;

    const newTokenDigits = [...tokenDigits];

    // Manejar caso de pegar un código completo
    if (value.length > 1) {
      const pastedValue = value.replace(/\D/g, '').slice(0, TOKEN_LENGTH);
      const newDigits = Array(TOKEN_LENGTH).fill('');

      pastedValue.split('').forEach((digit, idx) => {
        if (idx < TOKEN_LENGTH) {
          newDigits[idx] = digit;
        }
      });

      setTokenDigits(newDigits);
      const newToken = newDigits.join('');
      setFormData(prev => ({ ...prev, token: newToken }));

      // Si ya tenemos todos los dígitos, validar el token
      if (pastedValue.length === TOKEN_LENGTH) {
        validateToken(pastedValue);
      }

      return;
    }

    // Manejar caso normal de un solo dígito
    newTokenDigits[index] = value;
    setTokenDigits(newTokenDigits);

    const newToken = newTokenDigits.join('');
    setFormData(prev => ({ ...prev, token: newToken }));

    // Mover al siguiente input si se ingresó un dígito
    if (value && index < TOKEN_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Si ya tenemos todos los dígitos, validar el token
    if (newToken.length === TOKEN_LENGTH && !newToken.includes('')) {
      validateToken(newToken);
    }
  };

  const handleKeyDown = (index, e) => {
    // Navegar a la izquierda con la tecla de retroceso si el campo está vacío
    if (e.key === 'Backspace' && !tokenDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    // Navegar con flechas izquierda/derecha
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    if (e.key === 'ArrowRight' && index < TOKEN_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    if (!formData.token || formData.token.length !== TOKEN_LENGTH) {
      setError(
        'El código de recuperación debe tener ' + TOKEN_LENGTH + ' dígitos'
      );
      return false;
    }

    if (!tokenValidated) {
      setError('El código debe ser validado primero');
      return false;
    }

    if (!formData.password) {
      setError('La nueva contraseña es requerida');
      return false;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${API_ENDPOINTS.auth.changePassword}/${formData.token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            password: formData.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al restablecer la contraseña');
      }

      setSuccess(true);
      // Redirigir después de 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!success ? (
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <div className='text-center mb-2'>
            <h2 className='text-xl font-semibold text-black'>
              Restablecer Contraseña
            </h2>
            <p className='mt-2 text-xs text-gray-600'>
              Ingresa el código recibido por correo y crea tu nueva contraseña.
            </p>
          </div>

          <div>
            <Label
              htmlFor='token'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Código de Recuperación
            </Label>
            <div className='flex flex-col items-center gap-2'>
              <div className='flex justify-center gap-2'>
                {Array.from({ length: TOKEN_LENGTH }).map((_, index) => (
                  <Input
                    key={index}
                    type='text'
                    maxLength={1}
                    value={tokenDigits[index]}
                    className={`w-11 h-10 text-center border-0 border-b bg-transparent focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 rounded-none outline-none !shadow-none ${
                      tokenValidated
                        ? 'border-green-500 text-green-600'
                        : tokenError
                        ? 'border-red-500 text-red-600'
                        : 'border-purple-300 focus:border-purple-300'
                    }`}
                    style={{ boxShadow: 'none' }}
                    onChange={e => handleDigitChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    ref={el => (inputRefs.current[index] = el)}
                    onPaste={handlePaste}
                  />
                ))}
              </div>

              {/* Indicador de estado del token */}
              <div className='w-full flex items-center justify-center h-6 mt-1'>
                {isValidatingToken && (
                  <div className='flex items-center text-purple-600 text-xs'>
                    <Loader2 className='w-4 h-4 mr-1 animate-spin' />
                    Validando código...
                  </div>
                )}

                {!isValidatingToken && tokenValidated && (
                  <div className='flex items-center text-green-600 text-xs'>
                    <CheckCircle2 className='w-4 h-4 mr-1' />
                    Código válido
                  </div>
                )}

                {!isValidatingToken && tokenError && (
                  <div className='flex items-center text-red-600 text-xs'>
                    <XCircle className='w-4 h-4 mr-1' />
                    {tokenError}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Contraseña
            </Label>
            <div className='relative'>
              <Input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                autoComplete='new-password'
                required
                placeholder='••••••••'
                value={formData.password}
                onChange={handleChange}
                className='w-full h-10 rounded border-gray-300 bg-gray-50 focus:border-purple-500 focus:ring-purple-500 pr-10'
                disabled={!tokenValidated}
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600'
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Confirmar Contraseña
            </Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete='new-password'
                required
                placeholder='••••••••'
                value={formData.confirmPassword}
                onChange={handleChange}
                className='w-full h-10 rounded border-gray-300 bg-gray-50 focus:border-purple-500 focus:ring-purple-500 pr-10'
                disabled={!tokenValidated}
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600'
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>

          {error && (
            <Alert variant='destructive' className='py-2'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type='submit'
            disabled={isLoading || !tokenValidated}
            className={`w-full h-10 text-white rounded ${
              tokenValidated
                ? 'bg-purple-800 hover:bg-purple-900'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Procesando...
              </>
            ) : (
              'Restablecer'
            )}
          </Button>

          <div className='mt-1'>
            <Link href='/login'>
              <Button
                type='button'
                variant='outline'
                className='w-full h-10 hover:text-purple-800 bg-white border-gray-300 hover:bg-gray-50 text-purple-900 rounded'
              >
                Volver atrás
              </Button>
            </Link>
          </div>
        </form>
      ) : (
        <div className='text-center py-4'>
          <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4'>
            <svg
              className='h-6 w-6 text-green-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900'>
            ¡Contraseña restablecida!
          </h3>
          <p className='mt-2 text-sm text-gray-500 max-w-md mx-auto'>
            Tu contraseña ha sido restablecida correctamente. Serás redirigido a
            la página de inicio de sesión en unos segundos...
          </p>
        </div>
      )}
    </>
  );
}