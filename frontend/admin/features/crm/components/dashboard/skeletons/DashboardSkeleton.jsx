import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

/**
 * Componente que muestra un esqueleto de carga para el dashboard
 */
export const DashboardSkeleton = () => {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <Skeleton className='h-10 w-[180px]' />
        <div className='flex items-center space-x-2'>
          <Skeleton className='h-10 w-[100px]' />
          <Skeleton className='h-10 w-[100px]' />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Columna 1: Total Leads y gráfico */}
        <div className='space-y-4'>
          <Card>
            <CardContent className='pt-6'>
              <Skeleton className='h-4 w-[100px] mb-2' />
              <Skeleton className='h-8 w-[80px] mb-2' />
              <Skeleton className='h-4 w-[120px]' />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='py-2'>
              <Skeleton className='h-4 w-[150px] mb-2' />
              <Skeleton className='h-3 w-[100px]' />
            </CardHeader>
            <CardContent className='p-2'>
              <Skeleton className='h-[230px] w-full' />
            </CardContent>
          </Card>
        </div>

        {/* Columna 2: Leads Nuevos y gráfico */}
        <div className='space-y-4'>
          <Card>
            <CardContent className='pt-6'>
              <Skeleton className='h-4 w-[100px] mb-2' />
              <Skeleton className='h-8 w-[80px] mb-2' />
              <Skeleton className='h-4 w-[120px]' />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='py-2'>
              <Skeleton className='h-4 w-[150px] mb-2' />
              <Skeleton className='h-3 w-[100px]' />
            </CardHeader>
            <CardContent className='p-2'>
              <Skeleton className='h-[280px] w-full' />
            </CardContent>
          </Card>
        </div>

        {/* Columna 3: Calendario */}
        <Card className='h-full'>
          <CardHeader className='pb-1 pt-3'>
            <Skeleton className='h-4 w-[150px]' />
          </CardHeader>
          <CardContent className='p-2 pt-0'>
            <Skeleton className='h-[calc(100%-48px)] min-h-[300px] w-full' />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className='h-5 w-[200px] mb-2' />
          <Skeleton className='h-4 w-[250px]' />
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className='h-16 w-full mb-4' />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
