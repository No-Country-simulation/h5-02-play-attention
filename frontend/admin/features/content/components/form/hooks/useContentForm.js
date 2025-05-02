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
      setFormData({
        ...initialData,
        // Asegurar que se mantenga el ID de la categoría si ya existe
        categoryId: initialData.categoryId || '',
        file: null // Siempre reiniciamos el archivo
      });
    }
  }, [initialData]);

  // Cuando se cargan las categorías y estamos editando, necesitamos establecer la categoría correcta
  useEffect(() => {
    // Si tenemos categorías y estamos editando, intentamos encontrar la categoría por nombre
    if (categories.length > 0 && initialData && initialData.category) {
      // Intentar encontrar por ID primero si está disponible
      if (initialData.categoryId) {
        const foundCategory = categories.find(
          cat => cat.id === initialData.categoryId
        );
        if (foundCategory) {
          setFormData(prev => ({
            ...prev,
            categoryId: foundCategory.id,
            category: foundCategory.name
          }));
          return;
        }
      }

      // Si no hay ID o no se encontró por ID, intentar buscar por nombre
      const foundCategory = categories.find(
        cat =>
          cat.name.toLowerCase() ===
          (typeof initialData.category === 'string'
            ? initialData.category.toLowerCase()
            : initialData.category?.name?.toLowerCase() || '')
      );

      if (foundCategory) {
        setFormData(prev => ({
          ...prev,
          categoryId: foundCategory.id,
          category: foundCategory.name
        }));
      } else if (categories.length > 0) {
        // Si no se encuentra, seleccionar la primera categoría disponible
        setFormData(prev => ({
          ...prev,
          categoryId: categories[0].id,
          category: categories[0].name
        }));
      }
    } else if (categories.length > 0 && !formData.categoryId) {
      // Si no estamos editando y hay categorías, seleccionar la primera por defecto
      setFormData(prev => ({
        ...prev,
        categoryId: categories[0].id,
        category: categories[0].name
      }));
    }
  }, [categories, initialData, formData.categoryId]);

  // Manejar cambios en los campos del formulario
  const handleChange = e => {
    const { name, value } = e.target;

    // Caso especial para el cambio de categoría
    if (name === 'categoryId') {
      const selectedCategory = categories.find(cat => cat.id === value);
      setFormData(prev => ({
        ...prev,
        categoryId: value,
        category: selectedCategory ? selectedCategory.name : prev.category
      }));
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

    if (!validateForm()) {
      return;
    }

    // Crear el objeto de datos para enviar al backend
    const contentData = {
      ...formData,
      description: formData.content, // Mapear content a description
      category: formData.categoryId
    };

    // Si hay un archivo adjunto, no enviamos la URL generada localmente
    if (contentData.file) {
      // Si estamos enviando un archivo, no enviar la url temporal creada con createObjectURL
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
