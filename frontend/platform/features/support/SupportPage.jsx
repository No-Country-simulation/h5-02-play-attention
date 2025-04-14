'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('support');
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
      <h1 className='text-3xl font-bold mb-6'>{t('title')}</h1>
      <p className='text-gray-600 mb-8'>{t('description')}</p>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Support Options */}
        <div className='md:col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle>{t('supportOptions')}</CardTitle>
              <CardDescription>{t('chooseOption')}</CardDescription>
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
                        <span>{t('contactForm')}</span>
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
                        <span>{t('liveChat')}</span>
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
                        <span>{t('supportTicket')}</span>
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
                        <span>{t('faq')}</span>
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
                <CardTitle>{t('directContact')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex items-center'>
                    <Phone className='h-5 w-5 mr-3 text-blue-600' />
                    <div>
                      <p className='font-medium'>{t('phone')}</p>
                      <p className='text-sm text-gray-500'>+1 (800) 123-4567</p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <Mail className='h-5 w-5 mr-3 text-blue-600' />
                    <div>
                      <p className='font-medium'>{t('email')}</p>
                      <p className='text-sm text-gray-500'>
                        support@playattention.com
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className='font-medium mb-1'>{t('businessHours')}</p>
                    <p className='text-sm text-gray-500'>
                      {t('mondayToFriday')}: 9:00 AM - 5:00 PM EST
                    </p>
                    <p className='text-sm text-gray-500'>
                      {t('weekends')}: {t('closed')}
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
                  <CardTitle>{t('contactUs')}</CardTitle>
                  <CardDescription>{t('fillForm')}</CardDescription>
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
                      <p>{t('messageSent')}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className='space-y-4'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {t('name')} *
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
                            {t('email')} *
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
                          {t('subject')} *
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
                          {t('message')} *
                        </label>
                        <textarea
                          name='message'
                          required
                          rows='6'
                          value={contactForm.message}
                          onChange={handleInputChange}
                          className='w-full p-2 border rounded-md resize-none'
                        />
                      </div>

                      <button
                        type='submit'
                        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center'
                      >
                        <Send className='h-4 w-4 mr-2' />
                        {t('send')}
                      </button>
                    </form>
                  )}
                </CardContent>
              </>
            )}

            {activeTab === 'chat' && (
              <>
                <CardHeader>
                  <CardTitle>{t('liveChat')}</CardTitle>
                  <CardDescription>{t('chatDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='bg-gray-50 p-8 rounded-md text-center'>
                    <MessageSquare className='h-12 w-12 mx-auto text-blue-600 mb-4' />
                    <h3 className='text-lg font-medium mb-2'>
                      {t('startChat')}
                    </h3>
                    <p className='text-gray-500 mb-6'>
                      {t('agentAvailability')}
                    </p>
                    <button className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center mx-auto'>
                      <MessageSquare className='h-4 w-4 mr-2' />
                      {t('startChatButton')}
                    </button>
                  </div>
                </CardContent>
              </>
            )}

            {activeTab === 'ticket' && (
              <>
                <CardHeader>
                  <CardTitle>{t('createTicket')}</CardTitle>
                  <CardDescription>{t('ticketDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='bg-gray-50 p-8 rounded-md text-center'>
                    <Ticket className='h-12 w-12 mx-auto text-blue-600 mb-4' />
                    <h3 className='text-lg font-medium mb-2'>
                      {t('supportTicketSystem')}
                    </h3>
                    <p className='text-gray-500 mb-6'>{t('ticketHelp')}</p>
                    <button className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center mx-auto'>
                      <ArrowRight className='h-4 w-4 mr-2' />
                      {t('createNewTicket')}
                    </button>
                  </div>
                </CardContent>
              </>
            )}

            {activeTab === 'faq' && (
              <>
                <CardHeader>
                  <CardTitle>{t('faq')}</CardTitle>
                  <CardDescription>{t('faqDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-6'>
                    <div>
                      <h3 className='font-medium text-lg mb-2'>
                        {t('faqQuestion1')}
                      </h3>
                      <p className='text-gray-600'>{t('faqAnswer1')}</p>
                    </div>
                    <div>
                      <h3 className='font-medium text-lg mb-2'>
                        {t('faqQuestion2')}
                      </h3>
                      <p className='text-gray-600'>{t('faqAnswer2')}</p>
                    </div>
                    <div>
                      <h3 className='font-medium text-lg mb-2'>
                        {t('faqQuestion3')}
                      </h3>
                      <p className='text-gray-600'>{t('faqAnswer3')}</p>
                    </div>
                    <div>
                      <h3 className='font-medium text-lg mb-2'>
                        {t('faqQuestion4')}
                      </h3>
                      <p className='text-gray-600'>{t('faqAnswer4')}</p>
                    </div>
                    <div>
                      <h3 className='font-medium text-lg mb-2'>
                        {t('faqQuestion5')}
                      </h3>
                      <p className='text-gray-600'>{t('faqAnswer5')}</p>
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
