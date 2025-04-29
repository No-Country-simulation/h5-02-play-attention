"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { Menu, X,  } from "lucide-react";
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
              scrollToSection("operation");
              setIsMenuOpen(false);
            }}
            className={cn(
              "text-left font-medium",
              activeSection === "operation" ? "underline" : "underline-offset-4"
            )}
          >
            Funcionamiento
          </button>

          <button
            onClick={() => {
              scrollToSection("benefits");
              setIsMenuOpen(false);
            }}
            className={cn(
              "text-left font-medium",
              activeSection === "benefits"
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
              scrollToSection("faq");
              setIsMenuOpen(false);
            }}
            className={cn(
              "text-left font-medium",
              activeSection === "faq" ? "underline" : "underline-offset-4"
            )}
          >
            FAQ
          </button>
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
