import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Phone, Mail, Search, ChevronDown } from 'lucide-react';
import { faqConfig } from '../lib/config/faq';

const FAQ = ({ onContactSupport }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const searchInputRef = useRef(null);

  const toggleQuestion = index => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Set initial filtered FAQs and focus search input
  useEffect(() => {
    setFilteredFaqs(faqConfig);

    // Focus the search input when component mounts
    if (searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, []);

  // Filter FAQs based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFaqs(faqConfig);
    } else {
      const filtered = faqConfig.filter(
        faq =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFaqs(filtered);
    }
  }, [searchQuery]);

  return (
    <div className='relative'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h2 className='text-xl font-semibold mb-1'>Preguntas Frecuentes</h2>
          <p className='text-sm text-gray-500'>
            Respuestas a las dudas más comunes sobre Play Attention
          </p>
        </div>
        <Button
          onClick={onContactSupport}
          className='bg-purple-900 hover:bg-purple-800'
        >
          Contactar a soporte
        </Button>
      </div>

      <div className='relative mb-6'>
        <Input
          ref={searchInputRef}
          type='text'
          placeholder='Buscar en Preguntas Frecuentes...'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className='w-full pl-10'
        />
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
          <Search size={16} />
        </div>
      </div>

      <div className='space-y-0'>
        {filteredFaqs.map((faq, index) => (
          <div
            key={index}
            className={`border-b border-gray-200 ${
              expandedIndex === index ? 'bg-white' : ''
            }`}
          >
            <button
              className='w-full px-4 py-3 flex justify-between items-center text-left focus:outline-none'
              onClick={() => toggleQuestion(index)}
              aria-expanded={expandedIndex === index}
            >
              <span className='font-medium text-sm text-gray-800'>
                {faq.question}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform text-blue-500 ${
                  expandedIndex === index ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            {expandedIndex === index && (
              <div className='p-4 pt-1 text-sm text-gray-600'>{faq.answer}</div>
            )}
          </div>
        ))}

        {filteredFaqs.length === 0 && (
          <div className='text-center py-8'>
            <p className='text-gray-500'>
              No se encontraron resultados para "{searchQuery}"
            </p>
            <button
              className='text-purple-600 mt-2 text-sm hover:underline'
              onClick={() => setSearchQuery('')}
            >
              Mostrar todas las preguntas
            </button>
          </div>
        )}
      </div>

      <div className='mt-8 mx-auto w-full max-w-md'>
        <div className='border rounded-md overflow-hidden'>
          <h3 className='font-medium text-center py-2'>
            Horarios y Medios de Contacto
          </h3>
          <div className='grid grid-cols-2'>
            <div className='p-3 flex flex-row items-center'>
              <Phone size={16} className='mr-2 shrink-0 text-gray-600' />
              <div>
                <p className='font-medium text-sm'>Teléfono</p>
                <p className='text-xs'>Lun-Vie, 9:00-18:00</p>
                <p className='text-xs'>+1 (800) 123-4567</p>
              </div>
            </div>
            <div className='p-3 flex flex-row items-center'>
              <Mail size={16} className='mr-2 shrink-0 text-gray-600' />
              <div>
                <p className='font-medium text-sm'>Email</p>
                <p className='text-xs'>Respuesta en 24h</p>
                <p className='text-xs'>soporte@playattention.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
