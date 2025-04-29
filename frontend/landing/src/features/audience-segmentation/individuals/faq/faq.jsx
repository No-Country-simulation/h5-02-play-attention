"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";

export function FaqSection() {
  const [openItems, setOpenItems] = useState(["item-1"]);

  const faqItems = [
    {
      id: "item-1",
      question: "¿Cómo sé si yo o mi hijo necesitamos este programa?",
      answer:
        "Realizamos evaluaciones personalizadas con tests validados científicamente. Agenda una consulta inicial gratuita para identificar síntomas como falta de atención, hiperactividad o impulsividad.",
    },
    {
      id: "item-2",
      question: "¿Realmente funciona sin medicamentos?",
      answer:
        "Sí, nuestro programa está diseñado para proporcionar estrategias y herramientas que no dependen de medicación. Utilizamos técnicas basadas en evidencia científica que ayudan a mejorar la atención y el autocontrol.",
    },
    {
      id: "item-3",
      question: "¿Cuánto tiempo debo usar el sistema al día?",
      answer:
        "Recomendamos sesiones de 20-30 minutos diarios para obtener resultados óptimos. La consistencia es más importante que la duración de cada sesión.",
    },
    {
      id: "item-4",
      question: "¿Es compatible con terapias psicológicas o escolares?",
      answer:
        "Absolutamente. Nuestro programa complementa perfectamente otras intervenciones terapéuticas y educativas. De hecho, muchos profesionales lo recomiendan como apoyo adicional.",
    },
    {
      id: "item-5",
      question:
        "¿Cómo involucro a mi hijo en el programa sin que lo vea como una obligación?",
      answer:
        "Presentamos las actividades de forma lúdica y adaptada a cada edad. El programa está diseñado para ser atractivo y motivador, con elementos de gamificación que hacen que los niños quieran participar.",
    },
    {
      id: "item-6",
      question: "¿Qué resultados puedo esperar y en cuánto tiempo?",
      answer:
        "La mayoría de los usuarios notan mejoras en la concentración y reducción de impulsividad en 4-6 semanas. Los resultados varían según cada persona, pero con uso consistente, los beneficios suelen ser evidentes en el primer mes.",
    },
    {
      id: "item-7",
      question: "¿Es seguro para niños? ¿Tiene efectos secundarios?",
      answer:
        "El programa es completamente seguro y no invasivo. No presenta efectos secundarios negativos, ya que se basa en técnicas de entrenamiento cognitivo y conductual respaldadas por investigación científica.",
    },
    {
      id: "item-8",
      question: "¿Qué incluye el programa? ¿Necesito comprar algo adicional?",
      answer:
        "El programa incluye acceso completo a todas las herramientas, ejercicios, seguimiento de progreso y soporte técnico. No necesitas comprar nada adicional, todo está incluido en la suscripción.",
    },
    {
      id: "item-9",
      question: "¿Puedo usarlo si no tengo diagnóstico de TDAH?",
      answer:
        "Sí, el programa beneficia a cualquier persona que desee mejorar su atención, concentración y habilidades ejecutivas, incluso sin un diagnóstico formal de TDAH.",
    },
    {
      id: "item-10",
      question: "¿Puedo usar el programa si tengo una agenda muy ocupada?",
      answer:
        "El programa está diseñado para adaptarse a horarios ocupados. Las sesiones son breves y flexibles, y puedes acceder desde cualquier dispositivo en el momento que mejor te convenga.",
    },
  ];

  const handleValueChange = (value) => {
    setOpenItems(value);
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
                            onClick={() => {
                              const newOpenItems = openItems.includes(item.id)
                                ? openItems.filter((i) => i !== item.id)
                                : [...openItems, item.id];
                              setOpenItems(newOpenItems);
                            }}
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
                            onClick={() => {
                              const newOpenItems = openItems.includes(item.id)
                                ? openItems.filter((i) => i !== item.id)
                                : [...openItems, item.id];
                              setOpenItems(newOpenItems);
                            }}
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
