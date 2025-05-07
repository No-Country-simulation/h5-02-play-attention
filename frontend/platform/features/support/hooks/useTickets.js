import { useState, useEffect } from 'react';

// Mock data for demonstration
const MOCK_TICKETS = [
  {
    id: 'TK-2023-1542',
    subject: 'Problema con la calibración del sensor',
    status: 'Abierto',
    date: '15 Mar 2023',
    lastUpdate: '16 Mar 2023',
    assignedTo: 'Carlos',
    createdBy: 'Usuario',
    category: 'Hardware',
    origin: 'web',
    createdAt: '15 Mar 2023',
    updatedAt: '16 Mar 2023, 09:20',
    description:
      'Hola, estoy teniendo problemas para calibrar el sensor de neurofeedback. He seguido las instrucciones del manual pero sigue apareciendo un error de conexión.',
    conversation: [
      {
        author: 'Usuario',
        date: '15 Mar 2023, 14:32',
        content:
          'Hola, estoy teniendo problemas para calibrar el sensor de neurofeedback. He seguido las instrucciones del manual pero sigue apareciendo un error de conexión.',
        isUser: true
      },
      {
        author: 'Carlos',
        date: '15 Mar 2023, 15:45',
        content:
          'Hola, soy Carlos del equipo de soporte técnico. Lamento que estés experimentando problemas con la calibración. ¿Podrías decirme qué sistema operativo estás utilizando y si has instalado los controladores más recientes?',
        isUser: false
      },
      {
        author: 'Usuario',
        date: '16 Mar 2023, 09:20',
        content:
          'Estoy usando Windows 11 y sí, instalé los controladores que venían con el dispositivo, pero cuando conecto el USB, no parece detectarlo.',
        isUser: true
      }
    ]
  },
  {
    id: 'TK-2023-1543',
    subject: 'Problema con la calibración de sensor',
    status: 'En proceso',
    date: '10 Mar 2025',
    lastUpdate: '16 Mar 2023',
    assignedTo: 'Admin',
    createdBy: 'Usuario desconocido',
    category: 'bug',
    origin: 'crm',
    createdAt: '03/05/2025 09:49',
    updatedAt: '03/05/2025 09:49',
    description: 'No puedo calibrar el sensor correctamente, aparece un error'
  },
  {
    id: 'TK-2023-1544',
    subject: 'Problema con la calibración de sensor',
    status: 'Resuelto',
    date: '10 Mar 2025',
    lastUpdate: '16 Mar 2023',
    assignedTo: 'Admin',
    createdBy: 'Usuario desconocido',
    category: 'bug',
    origin: 'crm',
    createdAt: '03/05/2025 09:49',
    updatedAt: '03/05/2025 09:49',
    description: 'No puedo calibrar el sensor correctamente, aparece un error'
  }
];

export const useTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tickets (simulated with mock data)
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setTickets(MOCK_TICKETS);
        setError(null);
      } catch (err) {
        setError('Error al cargar los tickets. Inténtalo de nuevo más tarde.');
        console.error('Error fetching tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Create new ticket
  const createTicket = async ticketData => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const newTicket = {
        id: `TK-${Math.floor(Math.random() * 10000)}`,
        status: 'Abierto',
        date: new Date().toLocaleDateString(),
        lastUpdate: new Date().toLocaleDateString(),
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        ...ticketData
      };

      setTickets(prevTickets => [newTicket, ...prevTickets]);
      return { success: true, ticket: newTicket };
    } catch (err) {
      console.error('Error creating ticket:', err);
      return {
        success: false,
        error: 'Error al crear el ticket. Inténtalo de nuevo más tarde.'
      };
    }
  };

  // Get ticket by ID
  const getTicketById = id => {
    return tickets.find(ticket => ticket.id === id) || null;
  };

  // Select ticket for viewing
  const selectTicket = id => {
    const ticket = getTicketById(id);
    setSelectedTicket(ticket);
    return ticket;
  };

  return {
    tickets,
    selectedTicket,
    loading,
    error,
    createTicket,
    getTicketById,
    selectTicket,
    setSelectedTicket
  };
};

export default useTickets;
