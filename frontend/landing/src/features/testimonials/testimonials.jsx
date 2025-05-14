"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

import { testimonials } from "./testimonials-data";
import { TestimonialCard } from "./testimonial";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <div className="py-12 bg-[#f5f5f5]">
      <div className="container mx-auto px-4 lg:px-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary-900">
          Testimonios de nuestros clientes
        </h2>

        <div className="relative">
          {/* Botones */}
          <div className="absolute -top-14 right-0 flex gap-2 z-10">
            <Button className="bg-[#b8b8d1] p-2 w-10 h-10" onClick={scrollPrev}>
              <ChevronLeft className="!w-7 !h-7 stroke-[#1C1B1F]" />
            </Button>
            <Button className="bg-[#b8b8d1] p-2 w-10 h-10" onClick={scrollNext}>
              <ChevronRight className="!w-7 !h-7 stroke-[#1C1B1F]" />
            </Button>
          </div>

          {/* Carrusel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 px-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="min-w-[300px] flex-shrink-0 box-border"
                >
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
