"use client";
import { scrollToSection } from "@/shared/lib/section-navigation";
import { Button } from "@/shared/ui/button";
import HeroVideoDialog from "@/shared/ui/hero-video-dialog";

export function DemoVideosSection() {
  return (
    <div className="py-4 mb-8">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="max-w-4xl mx-auto flex flex-col gap-8 items-center text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary-900">
            Funcionamiento
          </h2>

          <p className="text-secondary-800 my-2 mx-auto font-normal text-xl">
            Descubre cómo Play Attention utiliza tecnología avanzada para
            mejorar tu rendimiento cognitivo
          </p>
      
          <div className="relative">
            <HeroVideoDialog
              className="block dark:hidden"
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
            <HeroVideoDialog
              className="hidden dark:block"
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

          <p className="text-secondary-900 font-normal text-md">
            Este video muestra paso a paso cómo utilizar el sistema Play
            Attention, desde la colocación del brazalete hasta la interpretación
            de los resultados.
          </p>

          <Button
            onClick={() => scrollToSection("contact")}
            className="min-w-3xs mt-2"
          >
            ¡Pídelo ahora mismo!
          </Button>
        </div>
      </div>
    </div>
  );
}
