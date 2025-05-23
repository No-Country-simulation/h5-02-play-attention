"use client";

import { MarqueeBenefits } from "@/shared/components/marquee-benefits/marquee-benefits";
import { BackgroundShapes } from "@/shared/ui/background-shapes";
import { Button } from "@/shared/ui/button";
import Image from "next/image";
import { useBenefits } from "./benefits";
import { scrollToSection } from "@/shared/lib/section-navigation";

export function HeroSection() {
  const benefits = useBenefits();

  return (
    <div className="relative overflow-hidden px-4 lg:px-20 m-0">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-primary-900 leading-tight">
              Tecnología clínicamente validada para Profesionales de la
              Salud Mental
            </h1>
            <p className="text-2xl text-primary-400">
              Para psicólogos, neurólogos y educadores: desde detección temprana
              hasta informes de progreso automatizados
            </p>
            <Button
              onClick={() => scrollToSection("contact")}
              className="min-w-3xs w-full sm:w-3xs my-2"
            >
              ¡Comienza Ahora!
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0">
              <BackgroundShapes className="z-0 rounded-2xl w-full" />
            </div>

            <Image
              src="/professionals/hero.png"
              alt="Persona usando el dispositivo Play Attention"
              width={1237}
              height={688}
              className="relative z-10 mx-auto w-full h-auto max-w-[800px] object-cover md:object-contain"
              priority
            />
          </div>
        </div>

        <div className="relative w-screen left-1/2 -translate-x-1/2 z-20 overflow-hidden -mt-8 pb-8">
          <div className="relative">
            <div
              className="absolute inset-x-0 h-[54px] w-screen -rotate-[4deg] lg:-rotate-[1deg] md:-rotate-[2deg] sm:-rotate-[3deg]
      bg-secondary-200 top-1/2 -translate-y-1/2 z-0"
              style={{ transformOrigin: "75% 50%" }}
            />

            <div className="relative z-10 py-8">
              <MarqueeBenefits benefits={benefits} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
