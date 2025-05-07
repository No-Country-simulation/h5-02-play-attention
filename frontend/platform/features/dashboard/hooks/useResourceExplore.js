import live from "../icons/live_tv.svg";
import library from "../icons/local_library.svg";
import docs from "../icons/docs.svg";

import videocam from "../icons/videocam.svg";

import stylus from "../icons/stylus_fountain_pen.svg";

export function useResourceExplore() {
  const resourceExplore = [
    {
      title: "Material Educativo",
      description:
        "Documentos, presentaciones y guías para usar Play Attention.",
      icon: library,
      path: "/educational-material",
    },
    {
      title: "Tutoriales",
      description: "Videos paso a paso para la instalación y uso del sistema.",
      icon: live,
      path: "/tutorials",
    },
    {
      title: "Artículos Médicos",
      description:
        "Contenido clínicamente validado sobre TDAH y mejora cognitiva.",
      icon: docs,
      path: "/medical-articles",
    },
    {
      title: "Videos de Demostración",
      description: "Demostraciones de ejercicios e historias de éxito.",
      icon: videocam,
      path: "/demo-videos",
    },
    {
      title: "Actividades",
      description:
        "Ejercicios interactivos complementarios para el entrenamiento cognitivo.",
      icon: stylus,
      path: "/activities",
    },
  ];

  return resourceExplore;
}
