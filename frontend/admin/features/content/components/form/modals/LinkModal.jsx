import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';

/**
 * Componente modal para enlaces
 * Sigue el principio de Responsabilidad Única (SRP) encargándose solo de la interfaz del modal
 */
export function LinkModal({ isOpen, onClose, onSubmit, link, onLinkChange }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>Agregar enlace</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-2 py-2'>
          <label className='text-sm font-medium'>Pega el enlace:</label>
          <input
            type='url'
            value={link}
            onChange={e => onLinkChange(e.target.value)}
            placeholder='https://...'
            className='w-full p-2 border border-gray-300 rounded-md'
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSubmit();
              }
            }}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type='button'
              variant='outline'
              className='h-9 px-4 border border-gray-300 rounded-md hover:bg-gray-50'
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type='button'
            onClick={onSubmit}
            variant='default'
            className='bg-purple-700 hover:bg-purple-800 h-9 px-4'
          >
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
