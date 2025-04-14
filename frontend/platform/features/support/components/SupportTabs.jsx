'use client';

import { useTranslations } from 'next-intl';
import {
  Mail,
  MessageSquare,
  Ticket,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';

export default function SupportTabs({ activeTab, setActiveTab }) {
  const t = useTranslations('support');

  const tabs = [
    { id: 'contact', icon: Mail, label: t('contactForm') },
    { id: 'chat', icon: MessageSquare, label: t('liveChat') },
    { id: 'ticket', icon: Ticket, label: t('supportTicket') },
    { id: 'faq', icon: HelpCircle, label: t('faq') }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('supportOptions')}</CardTitle>
        <CardDescription>{t('chooseOption')}</CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        <nav>
          <ul>
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between w-full p-4 text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className='flex items-center'>
                    <tab.icon className='h-5 w-5 mr-3' />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className='h-4 w-4' />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}
