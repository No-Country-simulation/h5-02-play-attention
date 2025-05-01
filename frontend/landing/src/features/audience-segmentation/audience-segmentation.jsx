"use client";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { Briefcase, Building2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { scrollToSection } from "@/shared/lib/section-navigation";
import { benefits } from "./benefits-data";

export function AudienceSegmentationSection() {
  const router = useRouter();
  return (
    <div className="bg-secondary-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary-900 mb-6">
            ¿Por qué elegir Play Attention?
          </h1>
          <p className="text-primary-900 max-w-3xl mx-auto">
            Nuestra tecnología de neurofeedback está diseñada para ayudar a
            diferentes perfiles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Personas */}
          <Card className="flex bg-secondary-100 flex-col justify-between p-0 shadow-none border-1 border-secondary-800">
            <CardContent className="pt-6 pb-2">
              <div className="flex flex-col items-start mb-4">
                <div className="bg-secondary-300 p-3 rounded-full mb-4">
                  <User className="h-6 w-6 text-primary-300" />
                </div>
                <h2 className="text-xl font-bold text-primary-900 mb-4">
                  Personas
                </h2>
              </div>
              <ul className="space-y-2 text-sm text-secondary-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Niños con dificultades de atención</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Adolescentes que buscan mejorar su rendimiento académico
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Adultos con problemas de concentración o estrés</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Personas mayores que desean mantener su agilidad mental
                  </span>
                </li>
              </ul>
            </CardContent>
            <Button
              variant="secondary"
              className="mt-auto text-primary w-full border-t-1 border-secondary-800 rounded-xl rounded-t-md shadow-none"
              onClick={() => router.push("/personas")}
            >
              Más info
            </Button>
          </Card>

          {/* Empresas */}
          <Card className="flex bg-secondary-100 flex-col justify-between p-0 shadow-none border-1 border-secondary-800">
            <CardContent className="pt-6 pb-2">
              <div className="flex flex-col items-start mb-4">
                <div className="bg-secondary-300 p-3 rounded-full mb-4">
                  <Building2 className="h-6 w-6 text-primary-300" />
                </div>
                <h2 className="text-xl font-bold text-primary-900 mb-4">
                  Empresas
                </h2>
              </div>
              <ul className="space-y-2 text-sm text-secondary-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Programas de bienestar corporativo</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Entrenamiento para equipos de alto rendimiento</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Reducción del estrés laboral y prevención del burnout
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Mejora de la productividad y concentración en el trabajo
                  </span>
                </li>
              </ul>
            </CardContent>
            <Button
              variant="secondary"
              className="mt-auto text-primary w-full border-t-1 border-secondary-800 rounded-xl rounded-t-md shadow-none"
              onClick={() => router.push("/empresas")}
            >
              Más info
            </Button>
          </Card>

          {/* Profesionales */}
          <Card className="flex bg-secondary-100 flex-col justify-between p-0 shadow-none border-1 border-secondary-800">
            <CardContent className="pt-6 pb-2">
              <div className="flex flex-col items-start mb-4">
                <div className="bg-secondary-300 p-3 rounded-full mb-4">
                  <Briefcase className="h-6 w-6 text-primary-300" />
                </div>
                <h2 className="text-xl font-bold text-primary-900 mb-4">
                  Profesionales
                </h2>
              </div>
              <ul className="space-y-2 text-sm text-secondary-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Psicólogos y terapeutas</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Educadores y profesionales de la enseñanza</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Entrenadores deportivos y de rendimiento</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Profesionales de la salud y bienestar</span>
                </li>
              </ul>
            </CardContent>
            <Button
              variant="secondary"
              className="mt-auto text-primary w-full border-t-1 border-secondary-800 rounded-xl rounded-t-md shadow-none"
              onClick={() => router.push("/profesionales")}
            >
              Más info
            </Button>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-18">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-normal text-primary-900 max-w-3xl mx-auto text-center mb-12"
        >
          Resultados medibles en la atención, el autocontrol y la calidad de
          vida.
        </motion.h1>

        <div className="max-w-5xl mx-auto">
          {benefits.map((feature, index) => (
            <FeatureCard
              key={index}
              index={index}
              title={feature.title}
              phrase={feature.phrase}
              subtitle={feature.subtitle}
              description={feature.description}
              imageSrc={feature.imageSrc}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  index,
  title,
  subtitle,
  phrase,
  description,
  imageSrc,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: index * 0.2,
            ease: "easeOut",
          },
        },
      }}
      className="mb-12 border rounded-lg overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row bg-neutral-white-400 border border-secondary-600 shadow-sm rounded-lg z-10 my-8">
        <div className="flex justify-between bg-primary-700 lg:rounded-b-none rounded-b-sm rounded-sm px-2 md:px-8 lg:w-2/5 relative mx-12 -mt-8 z-30">
          <div className="mt-8 mx-2">
            <h3 className="font-bold mb-2 text-neutral-white-500">
              {subtitle}
            </h3>
            <p className="text-neutral-white-700 mb-4 text-sm">{phrase}</p>
          </div>
          <div className="relative w-fit h-fit mb-8 mx-2">
            {/* Capa inferior (más oscura) */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: index + 0.4 }}
              className="absolute right-[-16px] bottom-[-16px] w-full h-full bg-primary-500 z-0 rotate-8"
            />

            {/* Capa media (más clara) */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: index + 0.6 }}
              className="absolute right-[-8px] bottom-[-8px] w-full h-full bg-primary-400 z-10 rotate-8"
            />

            {/* Imagen principal */}
            <motion.img
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index + 0.8 }}
              src={imageSrc || "/placeholder.svg"}
              alt={subtitle}
              className="relative z-20 w-30 max-w-24 h-60 object-cover rotate-8"
            />
          </div>
        </div>
        <div className="p-8 lg:w-3/5">
          <h2 className="text-2xl font-bold mb-4 text-primary-900">{title}</h2>
          <p className="text-secondary-800 mb-6">{description}</p>
          <Button
            className="min-w-3xs"
            onClick={() => scrollToSection("contact")}
          >
            Más info
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
