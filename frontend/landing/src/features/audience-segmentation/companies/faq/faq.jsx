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
      question: "¿Cómo ayuda a estudiantes con TDAH o dislexia?",
      answer:
        "Nuestro programa mejora la atención sostenida en un 62% y la comprensión lectora en un 45% (estudio en 15 colegios). Los profesores reciben informes semanales para ajustar estrategias en el aula.",
    },
    {
      id: "item-2",
      question: "¿Pueden capacitar a nuestros docentes?",
      answer:
        "Sí, ofrecemos talleres y formación continua para que los docentes integren eficazmente nuestro programa en el aula. La capacitación incluye guías prácticas, sesiones en vivo y soporte técnico permanente.",
    },
    {
      id: "item-3",
      question: "¿Es compatible con los programas de educación especial?",
      answer:
        "Totalmente. Nuestro sistema se adapta a distintos planes de educación personalizada y puede integrarse con intervenciones ya existentes, apoyando a docentes y terapeutas.",
    },
    {
      id: "item-4",
      question: "¿Cómo reducen el burnout en desarrolladores?",
      answer:
        "Nuestra plataforma promueve hábitos de atención plena y pausas activas. Además, ayuda a mejorar el enfoque y la productividad, reduciendo la fatiga mental asociada al trabajo prolongado frente a pantallas.",
    },
    {
      id: "item-5",
      question: "¿Mejora la calidad del código?",
      answer:
        "Sí. Al mejorar la atención y la gestión del tiempo, los desarrolladores cometen menos errores y pueden concentrarse más tiempo sin distracciones, lo que eleva la calidad del trabajo técnico.",
    },
    {
      id: "item-6",
      question: "¿Funciona para equipos async/remotos?",
      answer:
        "Sí. Nuestro sistema es 100% online y puede ser utilizado de forma asincrónica, facilitando su adopción por equipos distribuidos en distintas zonas horarias.",
    },
    {
      id: "item-7",
      question: "¿Aumenta el rendimiento en competencias?",
      answer:
        "Los usuarios reportan mejoras significativas en pruebas estandarizadas de atención, memoria y resolución de problemas, lo que se traduce en un mayor rendimiento académico y profesional.",
    },
    {
      id: "item-8",
      question: "¿Cómo aceleran la recuperación mental?",
      answer:
        "Incorporamos técnicas de neurofeedback y entrenamiento cognitivo que fortalecen las funciones ejecutivas del cerebro, acelerando la recuperación tras episodios de estrés o fatiga mental.",
    },
    {
      id: "item-9",
      question: "¿Qué infraestructura necesitamos?",
      answer:
        "Solo necesitas una conexión a internet y un dispositivo con navegador actualizado. No se requiere hardware adicional, ya que todo está basado en la nube.",
    },
    {
      id: "item-10",
      question: "¿Puedo probarlo antes de comprometer un presupuesto?",
      answer:
        "Sí, ofrecemos una prueba gratuita de 7 días sin compromiso, para que puedas evaluar los beneficios del programa antes de decidir su implementación completa.",
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
