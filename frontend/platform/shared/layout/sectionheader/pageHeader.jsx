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
};

export default function PageHeader({ sectionKey }) {
  const { title, description } = pageMetadata[sectionKey] || {
    title: "Sección no encontrada",
    description: "",
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
