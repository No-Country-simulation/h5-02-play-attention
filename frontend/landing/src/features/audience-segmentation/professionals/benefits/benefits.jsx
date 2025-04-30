"use client";
import { scrollToSection } from "@/shared/lib/section-navigation";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import Image from "next/image";

export function BenefitsSection() {
  return (
    <div className="py-12">
      <div className="relative overflow-hidden px-4 lg:px-20 m-0">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 items-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-primary-900">
              Beneficios para tu campo profesional
            </h2>

            <p className="text-secondary-800 my-2 mx-auto font-normal text-xl">
              En Play Attention entendemos que cada profesional tiene
              necesidades únicas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Psicólogos y psiquiatras */}
              <Card className="overflow-hidden bg-secondary-200 border-primary-100 shadow-md hover:shadow-lg transition-shadow rounded-lg">
                <div className="px-4">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden ">
                    <Image
                      src="/professionals/psychologists.jpg"
                      alt="Profesionales de la salud mental"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-primary-900">
                    Psicólogos y psiquiatras
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-4 pb-6">
                  <p className="text-primary-900">
                    Mejora tu práctica con métricas objetivas de atención e
                    impulsividad. Ajusta tratamientos basados en datos y
                    automatiza hasta el 70% de los informes clínicos.
                  </p>
                </CardContent>
              </Card>

              {/* Educadores y psicopedagogos */}
              <Card className="overflow-hidden bg-secondary-200 border-primary-100 shadow-md hover:shadow-lg transition-shadow rounded-lg">
                <div className="px-4">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden ">
                    <Image
                      src="/professionals/educators.jpg"
                      alt="Profesional de la educación"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <CardHeader className="text-center ">
                  <CardTitle className="text-2xl font-bold text-primary-900">
                    Educadores y psicopedagogos
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-4 pb-6">
                  <p className="text-primary-900">
                    Detecta dificultades de aprendizaje con evaluaciones
                    científicas y personaliza planes educativos.
                  </p>
                </CardContent>
              </Card>

              {/* Neurólogos y más */}
              <Card className="overflow-hidden bg-secondary-200 border-primary-100 shadow-md hover:shadow-lg transition-shadow rounded-lg">
                <div className="px-4">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden ">
                    <Image
                      src="/professionals/neurologists.jpg"
                      alt="Profesional de la salud neurológica"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <CardHeader className="text-center ">
                  <CardTitle className="text-2xl font-bold text-primary-900">
                    Neurólogos y más
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-4 pb-6">
                  <p className="text-primary-900">
                    Monitorea TDAH y trastornos del neurodesarrollo con
                    tecnología que complementa EEG y pruebas cognitivas. Detecta
                    cambios y tratamientos con precisión.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={() => scrollToSection("contact")}
              className="min-w-3xs mt-2"
            >
              ¡Contáctate con nosotros!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
