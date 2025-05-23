"use client";
import { scrollToSection } from "@/shared/lib/section-navigation";
import { Button } from "@/shared/ui/button";
import HeroVideoDialog from "@/shared/ui/hero-video-dialog";

export function OperationSection() {
  return (
    <div className="py-4">
      <div className="container mx-auto px-4 lg:px-20">
        {/* Título centrado */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary-900">
            ¿Cómo funciona?
          </h2>
        </div>

        {/* Contenido en dos columnas */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Video a la izquierda */}
          <div className="lg:w-1/2 w-full">
            <div className="relative">
              <HeroVideoDialog
                className="block dark:hidden"
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/MajIHSZN0oY"
                thumbnailSrc="https://img.youtube.com/vi/MajIHSZN0oY/maxresdefault.jpg"
                thumbnailAlt="Funcionalidad del dispositivo Play Attention en personas"
                customSubtitles={[
                  {
                    src: "/segmentation/subtittles.vtt",
                    label: "Español",
                    srcLang: "es",
                    default: true,
                  },
                ]}
              />
              <HeroVideoDialog
                className="hidden dark:block"
                animationStyle="from-center"
                videoSrc="https://www.youtube.com/embed/MajIHSZN0oY"
                thumbnailSrc="https://img.youtube.com/vi/MajIHSZN0oY/maxresdefault.jpg"
                thumbnailAlt="Funcionalidad del dispositivo Play Attention en personas"
                customSubtitles={[
                  {
                    src: "/segmentation/subtittles.vtt",
                    label: "Español",
                    srcLang: "es",
                    default: true,
                  },
                ]}
              />
            </div>
          </div>

          {/* Contenido de texto a la derecha */}
          <div className="lg:w-1/2 w-full flex flex-col gap-6">
            <p className="text-secondary-800 font-normal text-xl">
              Detecta tus ondas cerebrales en tiempo real y las convierte en
              ejercicios interactivos que entrenan tu atención. Con solo 20
              minutos diarios, tu cerebro aprende a mantenerse enfocado de forma
              natural.
            </p>

            <p className="text-secondary-900 font-semibold text-xl italic">
              (El video te mostrará el proceso en acción)
            </p>

            <div className="mt-4">
              <Button
                onClick={() => scrollToSection("contact")}
                className="min-w-3xs w-full sm:w-3xs"    
              >
                Solicitar info
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}