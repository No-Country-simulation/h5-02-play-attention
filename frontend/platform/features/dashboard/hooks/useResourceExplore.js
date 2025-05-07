import {
  FileText,
  Video,
  BookOpen,
  Images,
  PenTool,
  MessageCircle,
  Settings,
} from "lucide-react";

export function useResourceExplore() {
  const resourceExplore = [
    {
      title: "Material Educativo",
      description:
        "Documentos, presentaciones y guías para usar Play Attention.",
      icon: FileText,
      path: "/educational-material",
    },
    {
      title: "Tutoriales",
      description: "Videos paso a paso para la instalación y uso del sistema.",
      icon: Video,
      path: "/tutorials",
    },
    {
      title: "Artículos Médicos",
      description:
        "Contenido clínicamente validado sobre TDAH y mejora cognitiva.",
      icon: BookOpen,
      path: "/medical-articles",
    },
    {
      title: "Videos de Demostración",
      description: "Demostraciones de ejercicios e historias de éxito.",
      icon: Video,
      path: "/demo-videos",
    },

    {
      title: "Actividades",
      description:
        "Ejercicios interactivos complementarios para el entrenamiento cognitivo.",
      icon: PenTool,
      path: "/activities",
    },
  ];

  return resourceExplore;
}
