'use client';

import { FileText, Download } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';

export default function MaterialCard({ material }) {
  return (
    <Card key={material.id}>
      <CardHeader className='pb-3'>
        <div className='flex items-center space-x-3'>
          <div className='bg-blue-100 p-2 rounded-full'>
            <FileText className='h-5 w-5 text-blue-700' />
          </div>
          <CardTitle>{material.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className='mb-4'>
          {material.description}
        </CardDescription>
        <div className='flex justify-between items-center text-sm text-gray-500'>
          <span>
            {material.type.toUpperCase()} · {material.size}
          </span>
          <a
            href={material.downloadUrl}
            className='flex items-center text-blue-600 hover:text-blue-800'
          >
            <Download size={16} className='mr-1' />
            Descargar
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
