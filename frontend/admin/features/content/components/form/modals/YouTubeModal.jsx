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
 * Componente modal para YouTube
 * Sigue el principio de Responsabilidad Única (SRP) encargándose solo de la interfaz del modal
 */
export function YouTubeModal({
  isOpen,
  onClose,
  onSubmit,
  url,
  onUrlChange,
  error
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>Agregar video de YouTube</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-2 py-2'>
          <label className='text-sm font-medium'>
            Pega el enlace del video:
          </label>
          <input
            type='text'
            value={url}
            onChange={e => onUrlChange(e.target.value)}
            placeholder='https://www.youtube.com/watch?v=...'
            className='w-full p-2 border border-gray-300 rounded-md'
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSubmit();
              }
            }}
          />
          {error && <p className='text-red-500 text-sm'>{error}</p>}
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
