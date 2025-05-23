"use client";

import { BackgroundShapes } from "@/shared/ui/background-shapes";
import { Button } from "@/shared/ui/button";
import Image from "next/image";
import { MarqueeBenefits } from "./components/marquee-benefits";

export function HeroSection() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="relative overflow-hidden px-4 lg:px-20 m-0">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold text-primary-900 leading-tight">
              Entrenamiento Cerebral con Tecnología de la NASA.
              <span className="block">Ahora en Argentina.</span>
            </h1>
            <p className="text-2xl text-primary-400">
              Transformá la concentración, el autocontrol y el rendimiento
              cognitivo con Play Attention.
            </p>
            <Button
              onClick={() => scrollToSection("contact")}
              className="min-w-3xs w-full sm:w-3xs my-2"
            >
              Contacto
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0">
              {/* <BackgroundShapes className="z-0 rounded-2xl w-full" /> */}
            </div>

            <Image
              src="/banner.png"
              alt="Play attention pulsera en acción"
              width={786}
              height={524}
              className="relative z-10 mx-auto w-full max-w-[786px] h-auto object-contain rounded-2xl my-16"
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
              <MarqueeBenefits />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
