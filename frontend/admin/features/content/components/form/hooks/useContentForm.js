import { useState, useEffect } from 'react';
import {
  useCreateContent,
  useUpdateContent,
  useCategories
} from '../../../lib/hooks';

/**
 * Hook para manejar la lógica del formulario de contenido
 * Sigue el principio de Responsabilidad Única (SRP) gestionando solo la lógica del formulario
 */
export const useContentForm = (initialData, onCancel, onSuccess) => {
  const isEditing = !!initialData;

  // Hooks para crear/editar contenido
  const createMutation = useCreateContent();
  const updateMutation = isEditing ? useUpdateContent(initialData.id) : null;

  // Obtener categorías desde el backend
  const { data: categories = [], isLoading: loadingCategories } =
    useCategories();

  // Estado para controlar envío
  const isSubmitting =
    createMutation.isPending || updateMutation?.isPending || false;

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    title: '',
    type: 'Artículo',
    category: '',
    categoryId: '',
    content: '',
    status: 'Borrador',
    file: null,
    youtubeId: null,
    url: null
  });

  // Validación del formulario
  const [errors, setErrors] = useState({});

  // Si estamos editando, cargamos la información inicial
  useEffect(() => {
    if (initialData) {
      console.log('Cargando datos iniciales:', initialData);
      setFormData({
        ...initialData,
        // No establecer categoría por defecto, respetar la existente
        file: null // Siempre reiniciamos el archivo
      });
    }
  }, [initialData]);

  // Este useEffect solo debe ejecutarse una vez al cargar, no en cada cambio del formulario
  useEffect(() => {
    // Solo ejecutar si hay categorías disponibles y estamos en modo edición
    if (categories.length === 0 || !initialData) return;

    // Evitar sobrescribir una categoría que ya ha sido seleccionada por el usuario
    if (formData.categoryId && formData.categoryId !== initialData.categoryId) {
      console.log(
        'Manteniendo categoría seleccionada por el usuario:',
        formData.categoryId
      );
      return;
    }

    console.log('Inicializando categoría para modo edición');

    // Si el contenido tiene ya un categoryId, buscar y establecer esa categoría
    if (initialData.categoryId) {
      const foundCategory = categories.find(
        cat => cat.id === initialData.categoryId
      );

      if (foundCategory) {
        console.log('Categoría encontrada por ID:', foundCategory.name);
        setFormData(prev => ({
          ...prev,
          categoryId: foundCategory.id,
          category: foundCategory.name
        }));
      }
    }
    // Si no tiene categoryId pero tiene nombre de categoría, buscar por nombre
    else if (initialData.category) {
      const categoryName =
        typeof initialData.category === 'string'
          ? initialData.category
          : initialData.category?.name || '';

      if (categoryName) {
        const foundCategory = categories.find(
          cat => cat.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (foundCategory) {
          console.log('Categoría encontrada por nombre:', foundCategory.name);
          setFormData(prev => ({
            ...prev,
            categoryId: foundCategory.id,
            category: foundCategory.name
          }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, initialData]);

  // Manejar cambios en los campos del formulario
  const handleChange = e => {
    const { name, value } = e.target;

    // Caso especial para el cambio de categoría
    if (name === 'categoryId') {
      console.log('Categoría seleccionada manualmente:', value);
      const selectedCategory = categories.find(cat => cat.id === value);

      if (selectedCategory) {
        console.log('Estableciendo categoría a:', selectedCategory.name);

        // Usar Object.assign para forzar una actualización más profunda
        const updatedFormData = Object.assign({}, formData, {
          categoryId: value,
          category: selectedCategory.name
        });

        setFormData(updatedFormData);

        // Asegurar que el cambio se mantiene a través de un timeout
        setTimeout(() => {
          setFormData(current => {
            if (current.categoryId !== value) {
              console.log(
                'Categoría no se mantuvo, aplicando de nuevo:',
                value
              );
              return {
                ...current,
                categoryId: value,
                category: selectedCategory.name
              };
            }
            return current;
          });
        }, 10);
      } else {
        console.warn('No se encontró la categoría con ID:', value);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Función para validar el formulario antes de enviar
  const validateForm = () => {
    const newErrors = {};

    // Validación de campos requeridos por el backend
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }

    if (formData.title.length > 100) {
      newErrors.title = 'El título no puede exceder los 100 caracteres';
    }

    if (!formData.type) {
      newErrors.type = 'El tipo de recurso es obligatorio';
    }

    if (!formData.categoryId) {
      newErrors.category = 'La categoría es obligatoria';
    }

    // Validación específica según el tipo de contenido
    if (formData.type === 'PDF' && !formData.file && !formData.url) {
      newErrors.content = 'Debes subir un archivo PDF o proporcionar un enlace';
    } else if (
      formData.type === 'Video' &&
      !formData.file &&
      !formData.url &&
      !formData.youtubeId
    ) {
      newErrors.content =
        'Debes subir un video, proporcionar un enlace o agregar un video de YouTube';
    } else if (formData.type === 'Imagen' && !formData.file && !formData.url) {
      newErrors.content = 'Debes subir una imagen o proporcionar un enlace';
    } else if (
      formData.type === 'Presentación' &&
      !formData.file &&
      !formData.url
    ) {
      newErrors.content =
        'Debes subir una presentación o proporcionar un enlace';
    } else if (
      formData.type === 'Artículo' &&
      !formData.content.trim() &&
      !formData.file &&
      !formData.url &&
      !formData.youtubeId
    ) {
      newErrors.content = 'Debes proporcionar contenido, un archivo o un video';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = async e => {
    e.preventDefault();

    // Verificar una última vez que tenemos la categoría correcta
    const categorySelect = document.getElementById('categoryId');
    if (categorySelect && categorySelect.value !== formData.categoryId) {
      console.log('Corrigiendo categoría antes de enviar:', {
        actual: formData.categoryId,
        elemento: categorySelect.value
      });

      const selectedCategory = categories.find(
        cat => cat.id === categorySelect.value
      );

      setFormData(prev => ({
        ...prev,
        categoryId: categorySelect.value,
        category: selectedCategory ? selectedCategory.name : prev.category
      }));

      // Esperar a que se actualice el estado antes de continuar
      return setTimeout(() => handleSubmit(e), 50);
    }

    if (!validateForm()) {
      return;
    }

    // Crear el objeto de datos para enviar al backend
    const contentData = {
      ...formData,
      description: formData.content
    };

    // Log de verificación
    console.log('Enviando datos al backend:', {
      formDataCategoryId: formData.categoryId,
      formDataCategory: formData.category,
      finalCategoryId: contentData.categoryId
    });

    // Validación extra para asegurar que el categoryId está presente
    if (!contentData.categoryId) {
      console.error('Error: categoryId no está presente en el formulario');
      setErrors(prev => ({
        ...prev,
        category: 'Debes seleccionar una categoría'
      }));
      return;
    }

    // Si hay un archivo adjunto, no enviamos la URL generada localmente
    if (contentData.file) {
      contentData.url = null;
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync(contentData);
      } else {
        await createMutation.mutateAsync(contentData);
      }

      // Después de guardar, volvemos a la lista
      onCancel();

      // Si hay un callback de éxito, lo llamamos
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al guardar contenido:', error);
      // El toast ya se muestra desde los hooks
    }
  };

  // Opciones disponibles para el formulario
  const typeOptions = ['Artículo', 'Video', 'PDF', 'Imagen', 'Presentación'];
  const statusOptions = ['Borrador', 'Publicado'];

  return {
    formData,
    setFormData,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    isEditing,
    categories,
    loadingCategories,
    typeOptions,
    statusOptions,
    validateForm
  };
};
