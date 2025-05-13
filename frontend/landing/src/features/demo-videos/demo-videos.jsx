"use client"
import { scrollToSection } from "@/shared/lib/section-navigation"
import { Button } from "@/shared/ui/button"
import HeroVideoDialog from "@/shared/ui/hero-video-dialog"

export function DemoVideosSection() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary-900">Funcionamiento</h2>
          <p className="text-secondary-800 mt-4 mx-auto max-w-2xl font-normal text-lg">
            Descubre cómo Play Attention utiliza tecnología avanzada para mejorar tu rendimiento cognitivo
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mt-12">
          <div className="w-full md:w-1/2 relative">
            <HeroVideoDialog
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/--cFRiwAUzA"
              thumbnailSrc="https://img.youtube.com/vi/--cFRiwAUzA/maxresdefault.jpg"
              thumbnailAlt="Funcionalidad del dispositivo Play Attention en personas"
              customSubtitles={[
                {
                  src: "/subtitles.es.vtt",
                  label: "Español",
                  srcLang: "es",
                  default: true,
                },
              ]}
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <h3 className="text-2xl font-semibold text-primary-900">Tecnología interactiva para resultados reales</h3>

            <p className="text-secondary-800 font-normal">
              Play Attention permite a niños y adultos entrenar su concentración de manera efectiva a través de
              actividades interactivas que responden a su nivel de atención en tiempo real.
            </p>

            <p className="text-secondary-800 font-normal">
              Nuestro sistema educativo utiliza tecnología avanzada para crear un entorno de aprendizaje personalizado
              que se adapta a las necesidades específicas de cada usuario.
            </p>

            <Button
              onClick={() => scrollToSection("contact")}
              className="min-w-3xs w-full sm:w-3xs my-2"          
            >
              Quiero probarlo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
