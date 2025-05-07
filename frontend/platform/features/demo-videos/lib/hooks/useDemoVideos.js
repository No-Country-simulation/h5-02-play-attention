import { useState, useEffect } from "react";
import { fetchEducationalMaterials } from "../../../../shared/lib/api/content/api";

export function useDemoVideos() {
    const [demoVideos, setDemoVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRandomDifficulty = () => {
        const difficulties = ["Principiante", "Intermedio", "Avanzado"];
        return difficulties[Math.floor(Math.random() * difficulties.length)];
    };

    // Función para actualizar el progreso de un video solo si el nuevo progreso es mayor
    const updateVideoProgress = (videoId, newProgress) => {
        setDemoVideos((prevVideos) =>
            prevVideos.map((video) =>
                video.id === videoId
                    ? {
                        ...video,
                        progress: Math.max(video.progress, Math.round(newProgress)),
                    }
                    : video
            )
        );
    };

    useEffect(() => {
        const loadDemoVideos = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchEducationalMaterials();
                const filteredData = data.filter(
                    (item) => item.category?.name === "Videos Demostrativos"
                );

                // Get file sizes for all videos
                const videosWithSizes = await Promise.all(
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
                            type: item.type || "VIDEO",
                            date: formattedDate,
                            rawDate: item.createdAt,
                            url: item.url,
                            difficulty: item.difficulty || getRandomDifficulty(),
                            duration: item.duration || "---",
                            progress: item.progress || 0,
                            author: item.author || "Anónimo",
                            thumbnailUrl: item.thumbnailUrl || "/default-video-thumbnail.jpg",
                        };
                    })
                );

                setDemoVideos(videosWithSizes);
            } catch (err) {
                setError("Error al cargar los videos demostrativos");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadDemoVideos();
    }, []);

    const handleDownload = async (video, action = "view") => {
        if (!video.url || video.url === "#") {
            console.warn(`URL no disponible para: ${video.title}`);
            alert("Este video no tiene una URL válida");
            return;
        }

        try {
            if (action === "view") {
                // Para videos, los abrimos en una nueva pestaña
                if (video.url) {
                    window.open(video.url, "_blank");
                }
            } else {
                // Descargar el archivo
                const link = document.createElement("a");
                link.href = video.url;

                // Preparar nombre de archivo con la extensión correcta
                let fileName = video.title || "video";
                if (!fileName.toLowerCase().endsWith(".mp4")) {
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
        } catch (error) {
            console.error("Error al intentar abrir/descargar el video:", error);
            alert("Hubo un problema al intentar acceder al video");
        }
    };

    const validateVideo = (videoId) => {
        // Lógica para validar/verificar un video
        console.log(`Validando video con ID: ${videoId}`);
        // Aquí podrías implementar lógica adicional para marcar videos como verificados
    };

    return {
        demoVideos,
        isLoading,
        error,
        handleDownload,
        validateVideo,
        updateVideoProgress,
    };
} 