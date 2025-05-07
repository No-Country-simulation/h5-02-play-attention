import { useState, useEffect } from "react";
import { fetchEducationalMaterials } from "../../../../shared/lib/api/content/api";

export function useTutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRandomDifficulty = () => {
    const difficulties = ["Principiante", "Intermedio", "Avanzado"];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  // Función para actualizar el progreso de un tutorial solo si el nuevo progreso es mayor
  const updateTutorialProgress = (tutorialId, newProgress) => {
    setTutorials((prevTutorials) =>
      prevTutorials.map((tutorial) =>
        tutorial.id === tutorialId
          ? {
              ...tutorial,
              progress: Math.max(tutorial.progress, Math.round(newProgress)),
            }
          : tutorial
      )
    );
  };

  useEffect(() => {
    const loadTutorials = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchEducationalMaterials();
        const filteredData = data.filter(
          (item) => item.category?.name === "Tutoriales"
        );

        // Get file sizes for all tutorials
        const tutorialsWithSizes = await Promise.all(
          filteredData.map(async (item) => {
            const date = new Date(item.createdAt);
            const formattedDate = `${date.getDate()} de ${
              [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic",
              ][date.getMonth()]
            } ${date.getFullYear()}`;

            return {
              id: item._id,
              title: item.title,
              description: item.description,
              type: item.type || "PDF",
              date: formattedDate,
              rawDate: item.createdAt,
              url: item.url,
              difficulty: item.difficulty || getRandomDifficulty(),
              duration: item.duration || "---", // Campo adicional para tutoriales
              progress: item.progress || 0,
              author: item.author || "Anónimo", // Campo adicional para tutoriales
            };
          })
        );

        setTutorials(tutorialsWithSizes);
      } catch (err) {
        setError("Error al cargar los tutoriales");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTutorials();
  }, []);

  const handleDownload = async (tutorial, action = "view") => {
    if (!tutorial.url || tutorial.url === "#") {
      console.warn(`URL no disponible para: ${tutorial.title}`);
      alert("Este tutorial no tiene una URL de descarga válida");
      return;
    }

    try {
      if (action === "view") {
        // Para PDFs nunca deberíamos llegar aquí, pero por si acaso redirigimos a descarga
        if (tutorial.type.toLowerCase() === "pdf") {
          // Recursivamente llamamos a la misma función con action='download'
          handleDownload(tutorial, "download");
          return;
        }

        // Para otros tipos de archivos, los abrimos en una nueva pestaña
        if (tutorial.url) {
          window.open(tutorial.url, "_blank");
        }
      } else {
        // Descargar el archivo
        // Para PDFs, forzamos la descarga con extensión .pdf
        if (tutorial.type.toLowerCase() === "pdf") {
          // Preparar nombre de archivo con la extensión correcta
          let fileName = tutorial.title || "tutorial";
          if (!fileName.toLowerCase().endsWith(".pdf")) {
            fileName += ".pdf";
          }

          // Crear un blob desde la URL (esto garantiza que podamos controlar el nombre del archivo)
          try {
            const response = await fetch(tutorial.url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            // Limpieza
            setTimeout(() => {
              document.body.removeChild(link);
              window.URL.revokeObjectURL(blobUrl);
            }, 100);
          } catch (fetchError) {
            console.error("Error al obtener el PDF:", fetchError);
            // Fallback: intentar descarga directa
            const link = document.createElement("a");
            link.href = tutorial.url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
              document.body.removeChild(link);
            }, 100);
          }
        } else {
          // Para otros tipos de archivo, usamos el método estándar
          const link = document.createElement("a");
          link.href = tutorial.url;

          // Preparar nombre de archivo con la extensión correcta
          let fileName = tutorial.title || "tutorial";

          // Para otros tipos de archivo, podemos agregar la extensión correspondiente si no la tiene
          if (
            tutorial.type.toLowerCase() === "doc" &&
            !fileName.toLowerCase().endsWith(".doc") &&
            !fileName.toLowerCase().endsWith(".docx")
          ) {
            fileName += ".docx";
          } else if (
            tutorial.type.toLowerCase() === "ppt" &&
            !fileName.toLowerCase().endsWith(".ppt") &&
            !fileName.toLowerCase().endsWith(".pptx")
          ) {
            fileName += ".pptx";
          } else if (
            tutorial.type.toLowerCase() === "video" &&
            !fileName.toLowerCase().endsWith(".mp4")
          ) {
            fileName += ".mp4";
          }

          link.download = fileName;
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();

          // Limpieza
          setTimeout(() => {
            document.body.removeChild(link);
          }, 100);
        }
      }
    } catch (error) {
      console.error("Error al intentar abrir/descargar el tutorial:", error);
      alert("Hubo un problema al intentar acceder al tutorial");
    }
  };

  const validateTutorial = (tutorialId) => {
    // Lógica para validar/verificar un tutorial
    console.log(`Validando tutorial con ID: ${tutorialId}`);
    // Aquí podrías implementar lógica adicional para marcar tutoriales como verificados
  };

  return {
    tutorials,
    isLoading,
    error,
    handleDownload,
    validateTutorial,
    updateTutorialProgress,
  };
}
