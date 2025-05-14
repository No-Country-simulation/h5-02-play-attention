"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";

export function FaqSection() {
  const [openItems, setOpenItems] = useState(["item-1"]);

  const faqItems = [
    {
      id: "item-1",
      question: "¿Esta tecnología reemplaza a las terapias tradicionales?",
      answer:
        "No. Es una herramienta complementaria. Mejora la precisión diagnóstica y el seguimiento de avances, permitiendo que la terapia sea más personalizada y basada en evidencia.",
    },
    {
      id: "item-2",
      question: "¿Puedo usarlo en sesiones presenciales y online?",
      answer:
        "Sí. La plataforma es flexible y puede utilizarse tanto en sesiones presenciales como en línea, adaptándose a distintas modalidades de intervención.",
    },
    {
      id: "item-3",
      question: "¿En qué se basa la efectividad del sistema?",
      answer:
        "En estudios científicos, datos cuantificables y el uso de tecnología BrainAware™, diseñada para medir y mejorar funciones cognitivas clave como atención, memoria y control inhibitorio.",
    },
    {
      id: "item-4",
      question: "¿Qué tipo de pacientes pueden beneficiarse más?",
      answer:
        "Personas con TDAH, dificultades de aprendizaje, problemas de atención o quienes buscan potenciar sus funciones ejecutivas pueden obtener beneficios significativos.",
    },
    {
      id: "item-5",
      question: "¿Puede usarse en niños y adultos?",
      answer:
        "Sí. Está diseñado para adaptarse a diferentes edades, desde niños hasta adultos, personalizando los desafíos y métricas según el perfil del usuario.",
    },
    {
      id: "item-6",
      question:
        "¿Qué diferencia a esta herramienta de otros programas de estimulación cognitiva?",
      answer:
        "Integra estimulación en tiempo real, informes personalizados y seguimiento continuo, con base científica y resultados comprobables. No es solo estimulación pasiva.",
    },
    {
      id: "item-7",
      question:
        "¿Puedo integrar esta herramienta con otros tratamientos o estudios como EEG o pruebas psicológicas?",
      answer:
        "Sí. Es compatible con abordajes interdisciplinarios, potenciando los diagnósticos y el seguimiento clínico con métricas objetivas y exportables.",
    },
    {
      id: "item-8",
      question: "¿Cuánto tiempo toma ver resultados en los pacientes?",
      answer:
        "Depende del perfil del usuario, pero muchas personas comienzan a notar mejoras en atención sostenida y autorregulación a partir de las primeras 5 a 10 sesiones.",
    },
    {
      id: "item-9",
      question:
        "¿Es necesario tener conocimientos técnicos avanzados para usar la plataforma?",
      answer:
        "No. La plataforma es intuitiva y fácil de usar, tanto para profesionales como para usuarios sin experiencia técnica previa. Se ofrece soporte en todo momento.",
    },
    {
      id: "item-10",
      question: "¿Hay evidencia científica que respalde su uso?",
      answer:
        "Sí. Existen múltiples estudios clínicos y validaciones que respaldan la efectividad del sistema. Los resultados están disponibles para consulta profesional.",
    },
  ];

  const handleValueChange = (value) => {
    setOpenItems(value);
  };

  const handleOpenItem = (itemId) => {
    const newOpenItems = openItems.includes(itemId)
      ? openItems.filter((i) => i !== itemId)
      : [...openItems, itemId];
    setOpenItems(newOpenItems);
  };

  return (
    <div className="py-12">
      <div className="relative overflow-hidden px-4 lg:px-20 m-0">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto flex flex-col gap-8 items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-900">
              Preguntas Frecuentes
            </h2>

            <p className="text-secondary-800 my-2 text-center mx-auto font-normal text-xl">
              En Play Attention entendemos que comenzar un nuevo tratamiento
              genera dudas. Hemos recopilado las preguntas más frecuentes de
              nuestros pacientes sobre cómo funciona nuestro método, su
              seguridad y los resultados esperados.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                {faqItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm"
                    onClick={() => handleOpenItem(item.id)}
                  >
                    <Accordion
                      type="multiple"
                      value={openItems}
                      onValueChange={handleValueChange}
                      className="w-full"
                    >
                      <AccordionItem value={item.id}>
                        <div className="flex justify-between items-start p-4">
                          <AccordionTrigger className="text-left font-medium text-md text-primary-900 hover:no-underline flex-1 pr-2">
                            {item.question}
                          </AccordionTrigger>
                          <button
                            onClick={() => handleOpenItem(item.id)}
                            className="flex-shrink-0 p-1"
                          >
                            {openItems.includes(item.id) ? (
                              <X className="h-5 w-5 text-primary-900" />
                            ) : (
                              <Plus className="h-5 w-5 text-primary-900" />
                            )}
                          </button>
                        </div>
                        <AccordionContent className="px-4 pb-4 pt-0 text-primary-900">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {faqItems.slice(5).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm"
                    onClick={() => handleOpenItem(item.id)}
                  >
                    <Accordion
                      type="multiple"
                      value={openItems}
                      onValueChange={handleValueChange}
                      className="w-full"
                    >
                      <AccordionItem value={item.id}>
                        <div className="flex justify-between items-start p-4">
                          <AccordionTrigger className="text-left font-medium text-md text-primary-900 hover:no-underline flex-1 pr-2">
                            {item.question}
                          </AccordionTrigger>
                          <button
                            onClick={() => handleOpenItem(item.id)}
                            className="flex-shrink-0 p-1"
                          >
                            {openItems.includes(item.id) ? (
                              <X className="h-5 w-5 text-primary-900" />
                            ) : (
                              <Plus className="h-5 w-5 text-primary-900" />
                            )}
                          </button>
                        </div>
                        <AccordionContent className="px-4 pb-4 pt-0 text-primary-900">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
