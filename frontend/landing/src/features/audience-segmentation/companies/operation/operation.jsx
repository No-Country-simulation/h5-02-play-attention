"use client";
import { scrollToSection } from "@/shared/lib/section-navigation";
import { Button } from "@/shared/ui/button";
import HeroVideoDialog from "@/shared/ui/hero-video-dialog";

export function OperationSection() {
  return (
    <div className="py-4">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="max-w-4xl mx-auto flex flex-col gap-8 items-center text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary-900">
            ¿Cómo funciona?
          </h2>

          <p className="text-secondary-800 my-2 mx-auto font-normal text-xl">
            Detecta tus ondas cerebrales en tiempo real y las convierte en
            ejercicios interactivos que entrenan tu atención. Con solo 20
            minutos diarios, tu cerebro aprende a mantenerse enfocado de forma
            natural.
          </p>

          <p className="text-secondary-900 font-semibold text-xl italic">
            (El video siguiente te mostrará el proceso en acción)
          </p>

          <div className="relative">
            <HeroVideoDialog
              className="block dark:hidden"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/MajIHSZN0oY"
              thumbnailSrc="https://img.youtube.com/vi/MajIHSZN0oY/maxresdefault.jpg"
              thumbnailAlt="Funcionalidad del dispositivo Play Attention en personas"
            />
      
            <HeroVideoDialog
              className="hidden dark:block"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/MajIHSZN0oY"
              thumbnailSrc="https://img.youtube.com/vi/MajIHSZN0oY/maxresdefault.jpg"
              thumbnailAlt="Funcionalidad del dispositivo Play Attention en personas"
            />
          </div>

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
