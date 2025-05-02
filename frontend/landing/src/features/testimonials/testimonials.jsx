"use client";

import { usePathname } from "next/navigation";
import { Marquee } from "@/shared/ui/marquee";
import { TestimonialCard } from "./testimonial";
import { testimonials } from "./testimonials-data";

export function TestimonialsSection() {
  const pathname = usePathname();

  const routeToTypeMap = {
    "/": null,
    "/personas": "individuals",
    "/empresas": "companies",
    "/profesionales": "professionals",
  };

  const selectedType = routeToTypeMap[pathname] || null;

  const filteredTestimonials =
    selectedType === null
      ? testimonials
      : testimonials.filter((t) => t.type === selectedType);

  return (
    <div className="py-12">
      <div className="relative overflow-hidden px-4 lg:px-20 m-0">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary-900">
              Testimonios de nuestros clientes
            </h2>

            <div className="relative w-full overflow-hidden py-2">
              <Marquee
                pauseOnHover
                className={
                  selectedType === null
                    ? "[--duration:90s]"
                    : "[--duration:30s]"
                }
              >
                {filteredTestimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} {...testimonial} />
                ))}
              </Marquee>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
