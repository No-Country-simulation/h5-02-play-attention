"use client";

import { Button } from "@/shared/ui/button";
import { Lens } from "@/shared/ui/lens";
import Image from "next/image";

export function HeroSection() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 lg:px-20 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Mejora tu atención con BrainAware
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Basado en tecnología desarrollada por la NASA, Play Attention es
              un sistema de entrenamiento cognitivo con eficacia comprobada para
              mejorar la atención y reducir la impulsividad.
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection("contact")}
            >
              Solicitar Información
            </Button>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <Lens defaultPosition={{ x: 280, y: 300 }}>
                <Image
                  src="/hero.png"
                  alt="BrainAware - Entrenamiento cognitivo"
                  width={400}
                  height={400}
                  className="object-contain"
                  priority
                />
              </Lens>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
