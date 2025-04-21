'use client';

import { cn } from '@/shared/lib/utils';

/**
 * Componente de tabla siguiendo los principios SOLID:
 * - Cada componente tiene una sola responsabilidad (SRP)
 * - Componentes extensibles sin modificarlos (OCP)
 * - Interfaces específicas para cada componente (ISP)
 */

const Table = ({ className, ...props }) => (
  <div className='w-full overflow-auto'>
    <table
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
);
Table.displayName = 'Table';

const TableHeader = ({ className, ...props }) => (
  <thead className={cn('bg-gray-50', className)} {...props} />
);
TableHeader.displayName = 'TableHeader';

const TableBody = ({ className, ...props }) => (
  <tbody className={cn('', className)} {...props} />
);
TableBody.displayName = 'TableBody';

const TableFooter = ({ className, ...props }) => (
  <tfoot className={cn('bg-gray-50 font-medium', className)} {...props} />
);
TableFooter.displayName = 'TableFooter';

const TableRow = ({ className, ...props }) => (
  <tr
    className={cn('border-b transition-colors hover:bg-gray-50/50', className)}
    {...props}
  />
);
TableRow.displayName = 'TableRow';

const TableHead = ({ className, ...props }) => (
  <th
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-gray-500',
      className
    )}
    {...props}
  />
);
TableHead.displayName = 'TableHead';

const TableCell = ({ className, ...props }) => (
  <td className={cn('p-4 align-middle', className)} {...props} />
);
TableCell.displayName = 'TableCell';

const TableCaption = ({ className, ...props }) => (
  <caption className={cn('mt-4 text-sm text-gray-500', className)} {...props} />
);
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
};
