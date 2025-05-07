"use client";

const pageMetadata = {
  dashboard: {
    title: "Bienvenido a Play Attention",
    description:
      "Accede a recursos y materiales para mejorar las habilidades cognitivas y funciones ejecutivas.",
  },
  materialEducativo: {
    title: "Material Educativo",
    description:
      "Documentos, presentaciones y guías para usar Play Attention de manera efectiva.",
  },
  medicalArticles: {
    title: "Artículos Médicos",
    description:
      "Explora y accede a artículos médicos para mejorar tus habilidades",
  },
};

export default function PageHeader({ sectionKey }) {
  const { title, description } = pageMetadata[sectionKey] || {
    title: "Sección no encontrada",
    description: "",
  };

  return (
    <div className="h-[max-content] md:h-[15vh] flex flex-col justify-center m-4 md:m-0">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-1.5 md:mb-2">
        {title}
      </h1>
      <p className="text-gray-600 text-base sm:text-lg">{description}</p>
    </div>
  );
}
