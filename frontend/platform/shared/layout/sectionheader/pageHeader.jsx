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
    <div className=" h-[20vh] flex flex-col justify-center">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 text-lg">{description}</p>
    </div>
  );
}
