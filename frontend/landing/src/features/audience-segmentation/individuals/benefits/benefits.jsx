"use client";
import { scrollToSection } from "@/shared/lib/section-navigation";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import Image from "next/image";

export function BenefitsSection() {
  return (
    <div className="py-12">
      <div className="relative overflow-hidden px-4 lg:px-20 m-0">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 items-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-primary-900">
              Beneficios para ti
            </h2>

            <p className="text-secondary-800 my-2 mx-auto font-normal text-xl">
              Descubre beneficios específicos para ti: soluciones adaptadas a
              cada etapa de la vida.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Adultos */}
              <Card className="overflow-hidden bg-secondary-200 border-primary-100 shadow-md hover:shadow-lg transition-shadow rounded-lg">
                <div className="px-4">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden ">
                    <Image
                      src="/individuals/adults.jpg"
                      alt="Adulto trabajando en computadora"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-primary-900">Adultos</CardTitle>
                </CardHeader>
                <CardContent className="text-center px-4 pb-6">
                  <p className="text-primary-900">
                    Logra mayor productividad en el trabajo y reduce el estrés
                    con ejercicios diseñados para mantener tu enfoque durante
                    horas.
                  </p>
                </CardContent>
              </Card>

              {/* Adolescentes */}
              <Card className="overflow-hidden bg-secondary-200 border-primary-100 shadow-md hover:shadow-lg transition-shadow rounded-lg">
                <div className="px-4">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden ">
                    <Image
                      src="/individuals/teenagers.jpg"
                      alt="Adolescente junto a estantería"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <CardHeader className="text-center ">
                  <CardTitle className="text-2xl font-bold text-primary-900">
                    Adolescentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-4 pb-6">
                  <p className="text-primary-900">
                    Mejora tu rendimiento académico con técnicas que combaten la
                    distracción y ayudan a retener información fácilmente.
                  </p>
                </CardContent>
              </Card>

              {/* Padres de familia */}
              <Card className="overflow-hidden bg-secondary-200 border-primary-100 shadow-md hover:shadow-lg transition-shadow rounded-lg">
                <div className="px-4">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden ">
                    <Image
                      src="/individuals/parents.jpg"
                      alt="Familia ayudando a niño con tareas"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <CardHeader className="text-center ">
                  <CardTitle className="text-2xl font-bold text-primary-900">
                    Padres de familia
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-4 pb-6">
                  <p className="text-primary-900">
                    Apoya el desarrollo de tus hijos con herramientas efectivas
                    que fortalecen su atención y reducen frustraciones en el
                    hogar.
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
