'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { ArrowDownAZ, ArrowUpDown, Clock } from 'lucide-react';

const sortOptions = [
  {
    value: 'newest',
    label: 'Más recientes',
    icon: Clock
  },
  {
    value: 'oldest',
    label: 'Más antiguos',
    icon: Clock
  },
  {
    value: 'alphabetical',
    label: 'Alfabético',
    icon: ArrowDownAZ
  }
];

export default function UserSortSelect({ value, onValueChange }) {
  return (
    <div className='flex items-center gap-2'>
      <ArrowUpDown className='h-4 w-4 text-gray-500' />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Ordenar por' />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <div className='flex items-center gap-2'>
                <option.icon className='h-4 w-4' />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
