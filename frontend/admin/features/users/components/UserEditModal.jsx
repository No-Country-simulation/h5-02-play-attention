import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/ui/tooltip';
import { ROLES_USUARIO } from '../lib/hooks';

export default function UserEditModal({
  isOpen,
  onClose,
  user,
  formData,
  onChange,
  onSave
}) {
  if (!isOpen || !user) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
          <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
        </div>
        <span
          className='hidden sm:inline-block sm:align-middle sm:h-screen'
          aria-hidden='true'
        >
          &#8203;
        </span>
        <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
          <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
            <div className='sm:flex sm:items-start'>
              <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>
                  Editar usuario
                </h3>
                <div className='mt-2'>
                  <form className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Nombre
                      </label>
                      <input
                        type='text'
                        className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
                        value={formData.name}
                        onChange={e => onChange('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Correo electrónico
                      </label>
                      <input
                        type='email'
                        className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
                        value={formData.email}
                        onChange={e => onChange('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Rol
                      </label>
                      <select
                        className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
                        value={formData.role}
                        onChange={e => onChange('role', e.target.value)}
                      >
                        {ROLES_USUARIO.map(rol => (
                          <option key={rol.value} value={rol.value}>
                            {rol.label}
                          </option>
                        ))}
                      </select>
                      <p className='mt-1 text-sm text-gray-500'>
                        El rol determina qué acciones puede realizar el usuario.
                        Los permisos específicos se configuran en la sección
                        "Permisos y Roles".
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
            <button
              type='button'
              className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm'
              onClick={onSave}
            >
              Guardar cambios
            </button>
            <button
              type='button'
              className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
