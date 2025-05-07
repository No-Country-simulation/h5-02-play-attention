import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import { ArrowLeft, Send } from 'lucide-react';
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
      <div className='py-2 px-4 border-b flex items-center'>
        <Button variant='ghost' onClick={onBack} className='mr-2' size='sm'>
          <ArrowLeft className='h-4 w-4 mr-1' />
          <span>Volver</span>
        </Button>

        <div className='flex-1'>
          <h1 className='text-md font-semibold'>{ticket.subject}</h1>
          <div className='flex items-center text-xs text-gray-500 space-x-2'>
            <span>{ticket.id}</span>
            <span>•</span>
            <span>Creado: {ticket.createdAt}</span>
            {ticket.category && (
              <>
                <span>•</span>
                <span className='px-1.5 py-0.5 bg-gray-100 rounded text-xs'>
                  {ticket.category}
                </span>
              </>
            )}
          </div>
        </div>

        <Badge
          className='ml-4'
          variant={
            ticket.status === 'Abierto'
              ? 'secondary'
              : ticket.status === 'En proceso'
              ? 'warning'
              : 'success'
          }
        >
          {ticket.status}
        </Badge>
      </div>

      {/* Conversación */}
      <div className='flex-1 p-4 overflow-y-auto bg-gray-50 max-h-[400px]'>
        <div className='space-y-4'>
          {ticket.conversation &&
            ticket.conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!message.isUser && (
                  <div className='h-8 w-8 rounded-full overflow-hidden mr-2 mt-1 flex-shrink-0'>
                    <div className='bg-purple-600 text-white w-full h-full flex items-center justify-center font-semibold text-sm'>
                      {message.author.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg py-3 px-4 ${
                    message.isUser
                      ? 'bg-purple-900 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className='flex justify-between items-center'>
                    <p
                      className={`font-medium text-sm ${
                        message.isUser ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      {message.author}
                    </p>
                    <p
                      className={`text-xs ml-4 ${
                        message.isUser ? 'text-purple-200' : 'text-gray-500'
                      }`}
                    >
                      {message.date}
                    </p>
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      message.isUser ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
                {message.isUser && (
                  <div className='h-8 w-8 rounded-full overflow-hidden ml-2 mt-1 flex-shrink-0'>
                    <div className='bg-purple-600 text-white w-full h-full flex items-center justify-center font-semibold text-sm'>
                      U
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Input de mensaje */}
      <div className='border-t px-4 py-2'>
        <form onSubmit={handleSendMessage} className='flex'>
          <input
            type='text'
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder='Escribe tu mensaje...'
            className='flex-1 py-1.5 px-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
          />
          <Button
            type='submit'
            className='ml-2 bg-purple-700 hover:bg-purple-800'
            size='icon'
          >
            <Send className='h-4 w-4' />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetail;
