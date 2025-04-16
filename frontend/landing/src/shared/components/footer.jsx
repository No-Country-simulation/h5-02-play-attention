"use client";

import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Button } from "../ui/button";

export function Footer() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full border-t border-gray-200 bg-black text-white py-10 px-4 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna 1: Logo + descripción + redes */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white">Play Attention</h2>
          <p className="text-sm text-gray-300">
            Tecnología de neurofeedback para mejorar la atención, la memoria y
            el control impulsivo.
          </p>
          <div className="mt-4">
            <div className="flex gap-4 mt-2">
              {/* <a
                href="https://www.facebook.com/playattention"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  className="rounded-full cursor-pointer"                  
                >
                  <Facebook className="h-4 w-4" />
                </Button>
              </a> */}
              <a
                href="https://www.instagram.com/dislexiayconducta"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  className="rounded-full cursor-pointer"                  
                >
                  <Instagram className="h-4 w-4" />
                </Button>
              </a>
             {/*  <a
                href="https://www.linkedin.com/company/playattention"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="icon"
                  className="rounded-full cursor-pointer"                  
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              </a> */}
            </div>
          </div>
        </div>

        {/* Columna 2: Navegación */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => scrollToSection("hero")}
            className="text-left text-sm text-gray-300 hover:text-gray-100 transition"
          >
            Inicio
          </button>
          <button
            onClick={() => scrollToSection("demo-videos")}
            className="text-left text-sm text-gray-300 hover:text-gray-100 transition"
          >
            Beneficios
          </button>
          <button
            onClick={() => scrollToSection("audience-segmentation")}
            className="text-left text-sm text-gray-300 hover:text-gray-100 transition"
          >
            Soluciones
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-left text-sm text-gray-300 hover:text-gray-100  transition"
          >
            Contacto
          </button>
        </div>

        {/* Columna 3: Contacto */}
        <div className="flex flex-col gap-2 text-sm text-gray-300">
          <span className="font-semibold text-gray-300">Contáctanos</span>
          <p>Office Park - Km 42.5, Buenos Aires, Argentina 3324</p>
          <p>+123 456 7890</p>
          <p>contacto@playattention.com</p>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Play Attention. Todos los derechos
        reservados.
      </div>
    </footer>
  );
}
