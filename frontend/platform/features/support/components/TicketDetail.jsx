import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import React, { useState } from 'react';

const TicketDetail = ({ ticket, onBack, onEdit }) => {
  const [newMessage, setNewMessage] = useState('');

  if (!ticket) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <p className='text-gray-500'>
          Selecciona un ticket para ver los detalles
        </p>
        <Button variant='outline' onClick={onBack} className='mt-4'>
          Volver a la lista
        </Button>
      </div>
    );
  }

  const handleSendMessage = e => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // En un caso real, aquí enviaríamos el mensaje al backend
    console.log('Mensaje enviado:', newMessage);
    setNewMessage('');
  };

  return (
    <div className='h-full flex flex-col bg-white rounded-lg border overflow-hidden'>
      {/* Header */}
      <div className='p-4 border-b flex items-center'>
        <Button variant='ghost' onClick={onBack} className='mr-3' size='sm'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M19 12H5M12 19l-7-7 7-7' />
          </svg>
          <span className='ml-1'>Volver</span>
        </Button>

        <div className='flex-1'>
          <h1 className='text-lg font-semibold'>{ticket.subject}</h1>
          <div className='flex items-center text-sm text-gray-500 space-x-2'>
            <span>TK-{ticket.id}</span>
            <span>•</span>
            <span>Creado: {ticket.createdAt}</span>
          </div>
        </div>

        <Badge
          className='ml-4'
          variant={
            ticket.status === 'Abierto'
              ? 'default'
              : ticket.status === 'En proceso'
              ? 'warning'
              : 'success'
          }
        >
          {ticket.status}
        </Badge>
      </div>

      {/* Conversación */}
      <div className='flex-1 p-4 overflow-y-auto bg-gray-50'>
        <div className='space-y-4'>
          {ticket.conversation &&
            ticket.conversation.map((message, index) => (
              <div
                key={index}
                className={`max-w-3xl ${
                  message.isUser
                    ? 'ml-auto bg-purple-900 text-white'
                    : 'bg-gray-100'
                } p-4 rounded-lg`}
              >
                <div className='flex items-center gap-2 mb-1'>
                  {!message.isUser && (
                    <div className='bg-gray-200 text-purple-700 w-8 h-8 flex items-center justify-center rounded-full'>
                      {message.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        message.isUser ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      {message.author}
                    </p>
                    <p
                      className={`text-xs ${
                        message.isUser ? 'text-gray-200' : 'text-gray-500'
                      }`}
                    >
                      {message.date}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-sm ${
                    message.isUser ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Input de mensaje */}
      <div className='border-t p-4'>
        <form onSubmit={handleSendMessage} className='flex'>
          <input
            type='text'
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder='Escribe tu mensaje...'
            className='flex-1 p-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
          />
          <Button
            type='submit'
            className='bg-purple-600 hover:bg-purple-700 rounded-l-none'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='22' y1='2' x2='11' y2='13' />
              <polygon points='22 2 15 22 11 13 2 9 22 2' />
            </svg>
          </Button>
        </form>
        <p className='text-xs text-gray-500 mt-1'>
          Pulsa Enter para enviar tu mensaje. Los mensajes no se pueden editar.
        </p>
      </div>
    </div>
  );
};

export default TicketDetail;
