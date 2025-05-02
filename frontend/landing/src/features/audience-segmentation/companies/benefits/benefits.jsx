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
              Beneficios por sector
            </h2>

            <p className="text-secondary-800 my-2 mx-auto font-normal text-xl">
              Soluciones personalizadas para cada tipo de organización
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Instituciones educativas */}
              <Card className="overflow-hidden bg-secondary-200 border-primary-100 shadow-md hover:shadow-lg transition-shadow rounded-lg">
                <div className="px-4">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden ">
                    <Image
                      src="/companies/academy.jpg"
                      alt="Niños en clase de una escuela"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-primary-900">
                    Instituciones educativas
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-4 pb-6">
                  <p className="text-primary-900">
                    Ayudamos a estudiantes con dificultades de atención y
                    capacitamos docentes en técnicas innovadoras para aulas
                    inclusivas.
                  </p>
                </CardContent>
              </Card>

              {/* Empresas tecnológicas */}
              <Card className="overflow-hidden bg-secondary-200 border-primary-100 shadow-md hover:shadow-lg transition-shadow rounded-lg">
                <div className="px-4">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden ">
                    <Image
                      src="/companies/tech.jpg"
                      alt="Persona trabajando en computadora"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <CardHeader className="text-center ">
                  <CardTitle className="text-2xl font-bold text-primary-900">
                    Empresas tecnológicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-4 pb-6">
                  <p className="text-primary-900">
                    Combate el estrés laboral y desarrolla habilidades de
                    concentración profunda con herramientas científicamente para
                    el entorno corporativo.
                  </p>
                </CardContent>
              </Card>

              {/* Organizaciones deportivas */}
              <Card className="overflow-hidden bg-secondary-200 border-primary-100 shadow-md hover:shadow-lg transition-shadow rounded-lg">
                <div className="px-4">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden ">
                    <Image
                      src="/companies/sports.jpg"
                      alt="Persona haciendo deporte"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
                <CardHeader className="text-center ">
                  <CardTitle className="text-2xl font-bold text-primary-900">
                    Organizaciones deportivas
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-4 pb-6">
                  <p className="text-primary-900">
                    Mejora el enfoque en competencias clave y acelera la
                    recuperación mental con tecnología de biofeedback usada por
                    atletas de élite.
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
