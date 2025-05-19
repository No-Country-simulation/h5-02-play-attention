'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { ScrollArea } from '@/shared/ui/scroll-area';

export default function TicketConversation({ messages = [] }) {
  if (messages.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        No hay mensajes en este ticket.
      </div>
    );
  }

  return (
    <ScrollArea className='h-[500px] pr-4'>
      <div className='space-y-6'>
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.isAdminReply ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex max-w-[80%] ${
                message.isAdminReply ? 'flex-row-reverse' : 'flex-row'
              } gap-3`}
            >
              <Avatar className='h-10 w-10'>
                <AvatarImage
                  src={message.avatar || ''}
                  alt={message.author || 'Usuario'}
                />
                <AvatarFallback>
                  {message.isAdminReply ? 'AD' : 'US'}
                </AvatarFallback>
              </Avatar>

              <div
                className={`space-y-1 ${
                  message.isAdminReply
                    ? 'items-end text-right mr-3'
                    : 'items-start ml-3'
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-lg ${
                    message.isAdminReply
                      ? 'bg-[#1c1c22] text-white'
                      : 'bg-slate-100'
                  }`}
                >
                  <p className='text-sm'>{message.content}</p>
                </div>
                <div className='flex text-xs text-muted-foreground gap-2'>
                  <span>
                    {message.author ||
                      (message.isAdminReply ? 'Soporte' : 'Usuario')}
                  </span>
                  <span>•</span>
                  <span>
                    {format(new Date(message.date), 'dd MMM yyyy, HH:mm', {
                      locale: es
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
