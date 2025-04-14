'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';

export default function ResourceCard({ category }) {
  const t = useTranslations('dashboard');
  const commonT = useTranslations('common');
  const { title, description, icon: Icon, path, color } = category;

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader className='flex flex-row items-center gap-4 pb-2'>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className='h-5 w-5' />
        </div>
        <CardTitle className='text-xl'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-sm text-gray-500'>
          {description}
        </CardDescription>
        <Link
          href={path}
          className='inline-block mt-4 text-primary hover:underline'
        >
          {commonT('explore')} →
        </Link>
      </CardContent>
    </Card>
  );
}
