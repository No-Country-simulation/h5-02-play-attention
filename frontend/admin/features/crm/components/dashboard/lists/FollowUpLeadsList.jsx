import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { AlertTriangleIcon } from 'lucide-react';

/**
 * Componente para mostrar leads que requieren seguimiento
 * @param {Array} leads - Lista de leads sin seguimiento
 */
export const FollowUpLeadsList = ({ leads = [] }) => {
  // Función para calcular tiempo transcurrido
  const timePassedSince = dateString => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays < 1) return 'Hoy';
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `${diffDays} días`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas`;
      return `${Math.floor(diffDays / 30)} meses`;
    } catch (e) {
      return '';
    }
  };

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg font-medium flex items-center'>
          <AlertTriangleIcon className='h-5 w-5 mr-2 text-yellow-500' />
          Leads Sin Seguimiento
        </CardTitle>
        <CardDescription>
          Leads que requieren atención inmediata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {leads.slice(0, 3).map(lead => (
            <div
              key={lead.id}
              className='flex justify-between items-center p-3 bg-muted/50 rounded-md'
            >
              <div>
                <p className='font-medium'>{lead.name}</p>
                <p className='text-sm text-muted-foreground'>{lead.email}</p>
              </div>
              <Badge
                variant='outline'
                className='bg-yellow-50 text-yellow-700 border-yellow-200'
              >
                {timePassedSince(lead.createdAt) || 'Pendiente'}
              </Badge>
            </div>
          ))}

          {leads.length === 0 && (
            <div className='py-8 text-center'>
              <p className='text-muted-foreground'>
                No hay leads pendientes de seguimiento
              </p>
            </div>
          )}

          {leads.length > 3 && (
            <Button variant='ghost' className='w-full mt-2'>
              Ver todos ({leads.length})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
