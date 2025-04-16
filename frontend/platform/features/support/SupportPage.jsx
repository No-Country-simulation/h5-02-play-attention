'use client';

import { useState } from 'react';
import {
  MessageSquare,
  Ticket,
  Mail,
  Phone,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Send
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';

export default function SupportPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [activeTab, setActiveTab] = useState('contact');
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Submit logic would go here (API call in production)
    console.log('Form submitted:', contactForm);
    setSubmitted(true);
    // Reset form after submission
    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className='p-8'>
      <h1 className='text-3xl font-bold mb-6'>Centro de Soporte</h1>
      <p className='text-gray-600 mb-8'>
        Obtén ayuda y asistencia con Play Attention. Elige entre las opciones a
        continuación para contactar a nuestro equipo.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Support Options */}
        <div className='md:col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle>Opciones de Soporte</CardTitle>
              <CardDescription>
                Selecciona cómo te gustaría obtener ayuda
              </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
              <nav>
                <ul>
                  <li>
                    <button
                      onClick={() => setActiveTab('contact')}
                      className={`flex items-center justify-between w-full p-4 text-left ${
                        activeTab === 'contact'
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className='flex items-center'>
                        <Mail className='h-5 w-5 mr-3' />
                        <span>Formulario de Contacto</span>
                      </div>
                      <ChevronRight className='h-4 w-4' />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('chat')}
                      className={`flex items-center justify-between w-full p-4 text-left ${
                        activeTab === 'chat'
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className='flex items-center'>
                        <MessageSquare className='h-5 w-5 mr-3' />
                        <span>Chat en Vivo</span>
                      </div>
                      <ChevronRight className='h-4 w-4' />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('ticket')}
                      className={`flex items-center justify-between w-full p-4 text-left ${
                        activeTab === 'ticket'
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className='flex items-center'>
                        <Ticket className='h-5 w-5 mr-3' />
                        <span>Ticket de Soporte</span>
                      </div>
                      <ChevronRight className='h-4 w-4' />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('faq')}
                      className={`flex items-center justify-between w-full p-4 text-left ${
                        activeTab === 'faq'
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className='flex items-center'>
                        <HelpCircle className='h-5 w-5 mr-3' />
                        <span>Preguntas Frecuentes</span>
                      </div>
                      <ChevronRight className='h-4 w-4' />
                    </button>
                  </li>
                </ul>
              </nav>
            </CardContent>
          </Card>

          <div className='mt-8'>
            <Card>
              <CardHeader>
                <CardTitle>Contacto Directo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center'>
                    <Phone className='h-5 w-5 mr-3 text-blue-600' />
                    <div>
                      <p className='font-medium'>Teléfono</p>
                      <p className='text-sm text-gray-500'>+1 (800) 123-4567</p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <Mail className='h-5 w-5 mr-3 text-blue-600' />
                    <div>
                      <p className='font-medium'>Correo electrónico</p>
                      <p className='text-sm text-gray-500'>
                        support@playattention.com
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className='font-medium mb-1'>Horario de Atención</p>
                    <p className='text-sm text-gray-500'>
                      Lunes a Viernes: 9:00 AM - 5:00 PM EST
                    </p>
                    <p className='text-sm text-gray-500'>
                      Fines de semana: Cerrado
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Support Content */}
        <div className='md:col-span-2'>
          <Card>
            {activeTab === 'contact' && (
              <>
                <CardHeader>
                  <CardTitle>Contáctanos</CardTitle>
                  <CardDescription>
                    Completa el formulario a continuación y te responderemos lo
                    antes posible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className='bg-green-50 text-green-700 p-4 rounded-md mb-4 flex items-center'>
                      <div className='mr-3 bg-green-100 rounded-full p-1'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <p>
                        Tu mensaje ha sido enviado correctamente. Responderemos
                        lo antes posible.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className='space-y-4'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Nombre *
                          </label>
                          <input
                            type='text'
                            name='name'
                            required
                            value={contactForm.name}
                            onChange={handleInputChange}
                            className='w-full p-2 border rounded-md'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Correo electrónico *
                          </label>
                          <input
                            type='email'
                            name='email'
                            required
                            value={contactForm.email}
                            onChange={handleInputChange}
                            className='w-full p-2 border rounded-md'
                          />
                        </div>
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Asunto *
                        </label>
                        <input
                          type='text'
                          name='subject'
                          required
                          value={contactForm.subject}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded-md'
                        />
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Mensaje *
                        </label>
                        <textarea
                          name='message'
                          required
                          value={contactForm.message}
                          onChange={handleInputChange}
                          rows={4}
                          className='w-full p-2 border rounded-md'
                        ></textarea>
                      </div>

                      <button
                        type='submit'
                        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center'
                      >
                        <Send className='h-4 w-4 mr-2' />
                        Enviar Mensaje
                      </button>
                    </form>
                  )}
                </CardContent>
              </>
            )}

            {activeTab === 'chat' && (
              <>
                <CardHeader>
                  <CardTitle>Chat en Vivo</CardTitle>
                  <CardDescription>
                    Habla con nuestros agentes de soporte en tiempo real
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='text-center py-10 px-4'>
                    <MessageSquare className='h-16 w-16 mx-auto text-blue-600 mb-4' />
                    <h3 className='text-lg font-medium mb-2'>
                      Iniciar un Chat en Vivo
                    </h3>
                    <p className='text-gray-500 mb-6'>
                      Nuestros agentes de soporte están disponibles de lunes a
                      viernes, de 9:00 AM a 5:00 PM EST
                    </p>
                    <button className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center'>
                      <MessageSquare className='h-5 w-5 mr-2' />
                      Iniciar Chat Ahora
                    </button>
                  </div>
                </CardContent>
              </>
            )}

            {activeTab === 'ticket' && (
              <>
                <CardHeader>
                  <CardTitle>Crear un Ticket de Soporte</CardTitle>
                  <CardDescription>
                    Envía un ticket para problemas que requieren investigación
                    detallada
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='text-center py-10 px-4'>
                    <Ticket className='h-16 w-16 mx-auto text-blue-600 mb-4' />
                    <h3 className='text-lg font-medium mb-2'>
                      Sistema de Tickets de Soporte
                    </h3>
                    <p className='text-gray-500 mb-6'>
                      Crea un nuevo ticket y nuestros especialistas revisarán tu
                      problema
                    </p>
                    <button className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center'>
                      <ArrowRight className='h-5 w-5 mr-2' />
                      Crear Nuevo Ticket
                    </button>
                  </div>
                </CardContent>
              </>
            )}

            {activeTab === 'faq' && (
              <>
                <CardHeader>
                  <CardTitle>Preguntas Frecuentes</CardTitle>
                  <CardDescription>
                    Encuentra respuestas a preguntas comunes sobre Play
                    Attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-6'>
                    <div>
                      <h3 className='text-lg font-medium mb-2'>
                        ¿Qué es Play Attention y cómo funciona?
                      </h3>
                      <p className='text-gray-600'>
                        Play Attention es un programa de entrenamiento cognitivo
                        que utiliza tecnología inspirada en la NASA para ayudar
                        a mejorar el enfoque, la atención y la función
                        ejecutiva. Funciona proporcionando retroalimentación en
                        tiempo real durante ejercicios interactivos, entrenando
                        tu cerebro para mantener la atención.
                      </p>
                    </div>
                    <div>
                      <h3 className='text-lg font-medium mb-2'>
                        ¿Cuánto tiempo toma ver resultados?
                      </h3>
                      <p className='text-gray-600'>
                        La mayoría de los usuarios comienzan a notar mejoras
                        después de 8-10 sesiones. Se recomienda una práctica
                        constante (2-3 sesiones por semana) para obtener
                        resultados óptimos. Cambios más significativos
                        típicamente se observan después de 3-6 meses de uso
                        regular.
                      </p>
                    </div>
                    <div>
                      <h3 className='text-lg font-medium mb-2'>
                        ¿Es Play Attention adecuado para todas las edades?
                      </h3>
                      <p className='text-gray-600'>
                        Sí, Play Attention puede ser beneficioso para niños
                        (7+), adolescentes y adultos. El programa se ajusta al
                        nivel de habilidad de cada usuario y proporciona
                        desafíos apropiados para cada edad.
                      </p>
                    </div>
                    <div>
                      <h3 className='text-lg font-medium mb-2'>
                        ¿Necesito algún equipo especial para usar Play
                        Attention?
                      </h3>
                      <p className='text-gray-600'>
                        El requisito básico es una computadora con acceso a
                        internet. La tecnología BrainAware™ funciona con nuestro
                        hardware especializado que está incluido con tu compra.
                      </p>
                    </div>
                    <div>
                      <h3 className='text-lg font-medium mb-2'>
                        ¿Puede Play Attention reemplazar la medicación para el
                        TDAH?
                      </h3>
                      <p className='text-gray-600'>
                        Play Attention no está destinado a reemplazar la
                        medicación, pero puede usarse como un enfoque
                        complementario. Muchos usuarios reportan mejores
                        resultados cuando combinan Play Attention con su
                        tratamiento médico. Siempre consulta con un profesional
                        de la salud con respecto a las decisiones de
                        tratamiento.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
