"use client";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NavbarMobile({
  isMenuOpen,
  setIsMenuOpen,
  scrollToSection,
  activeSection,
}) {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        className="lg:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={cn(
          "absolute left-0 right-0 top-[56px] z-50 bg-white p-4 shadow-lg lg:hidden",
          isMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => {
              scrollToSection("hero");
              setIsMenuOpen(false);
            }}
            className={cn(
              "text-left font-medium",
              activeSection === "hero" ? "underline" : "underline-offset-4"
            )}
          >
            Inicio
          </button>
          <button
            onClick={() => {
              scrollToSection("demo-videos");
              setIsMenuOpen(false);
            }}
            className={cn(
              "text-left font-medium",
              activeSection === "demo-videos"
                ? "underline"
                : "underline-offset-4"
            )}
          >
            Funcionamiento
          </button>

          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              className={cn(
                "flex items-center justify-between font-medium",
                activeSection === "audience-segmentation"
                  ? "underline"
                  : "underline-offset-4"
              )}
            >
              ¿Para quién es?
              <ChevronDown
                size={16}
                className={cn(
                  "transition-transform",
                  solutionsOpen ? "rotate-180" : ""
                )}
              />
            </button>
            {solutionsOpen && (
              <div className="ml-4 flex flex-col space-y-2">
                <button
                  onClick={() => {
                    router.push("/personas");
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-sm text-gray-700"
                >
                  Personas
                </button>
                <button
                  onClick={() => {
                    router.push("/profesionales");
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-sm text-gray-700"
                >
                  Profesionales
                </button>
                <button
                  onClick={() => {
                    router.push("/empresas");
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-sm text-gray-700"
                >
                  Empresas
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              scrollToSection("pricing-plans");
              setIsMenuOpen(false);
            }}
            className={cn(
              "text-left font-medium",
              activeSection === "pricing-plans"
                ? "underline"
                : "underline-offset-4"
            )}
          >
            Beneficios
          </button>
          <button
            onClick={() => {
              scrollToSection("testimonials");
              setIsMenuOpen(false);
            }}
            className={cn(
              "text-left font-medium",
              activeSection === "testimonials"
                ? "underline"
                : "underline-offset-4"
            )}
          >
            Testimonios
          </button>
          {/* <button
            onClick={() => {
              scrollToSection("about-us");
              setIsMenuOpen(false);
            }}
            className={cn(
              "text-left font-medium",
              activeSection === "about-us" ? "underline" : "underline-offset-4"
            )}
          >
            Nosotros
          </button> */}
          <Button
            className="max-w-3xs rounded-md"
            onClick={() => {
              scrollToSection("contact");
              setIsMenuOpen(false);
            }}
          >
            Contacto
          </Button>
        </div>
      </div>
    </>
  );
}
