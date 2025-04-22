"use client";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function NavbarMobile({
  isMenuOpen,
  setIsMenuOpen,
  scrollToSection,
  activeSection,
}) {
  const [solutionsOpen, setSolutionsOpen] = useState(false);

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
          "absolute left-0 right-0 top-[61px] z-50 bg-white p-4 shadow-lg lg:hidden",
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
              Soluciones
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
                    scrollToSection("audience-segmentation");
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-sm text-gray-700"
                >
                  Para empresas
                </button>
                <button
                  onClick={() => {
                    scrollToSection("audience-segmentation");
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-sm text-gray-700"
                >
                  Para educación
                </button>
                <button
                  onClick={() => {
                    scrollToSection("audience-segmentation");
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-sm text-gray-700"
                >
                  Personal
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
          <button
            onClick={() => {
              scrollToSection("about-us");
              setIsMenuOpen(false);
            }}
            className={cn(
              "text-left font-medium",
              activeSection === "about-us" ? "underline" : "underline-offset-4"
            )}
          >
            Sobre nosotros
          </button>
          <Button
            className="w-full rounded-md"
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
