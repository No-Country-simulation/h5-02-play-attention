"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero",
        "demo-videos",
        "audience-segmentation",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-sidebar py-3 px-4 md:px-6">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollToSection("hero")}
          className="text-2xl font-bold text-secondary"
        >
          Play Attention
        </button>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Button
            onClick={() => scrollToSection("hero")}
            variant="link"
            className={cn(
              "text-base font-medium",
              activeSection === "hero" ? "text-foreground/100" : "text-foreground/85"
            )}
          >
            Inicio
          </Button>
          <Button
            onClick={() => scrollToSection("demo-videos")}
            variant="link"
            className={cn(
              "text-base font-medium text-primary-600",
              activeSection === "demo-videos"
                ? "text-foreground/100"
                : "text-foreground/85"
            )}
          >
            Beneficios
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex items-center gap-1 text-base font-medium",
                activeSection === "audience-segmentation"
                  ? "text-foreground/100"
                  : "text-foreground/85"
              )}
            >
              Soluciones <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => scrollToSection("audience-segmentation")}
              >
                Para empresas
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => scrollToSection("audience-segmentation")}
              >
                Para educación
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => scrollToSection("audience-segmentation")}
              >
                Personal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => scrollToSection("contact")}
            variant="link"            
            className={cn(
              "text-base font-medium",
              activeSection === "contact"
                ? "text-foreground/100"
                : "text-foreground/85"
            )}
          >
            Contacto
          </Button>
          <Button variant="secondary" className="rounded-md">Acceder</Button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "absolute left-0 right-0 top-[61px] z-50 bg-white p-4 shadow-lg md:hidden",
            isMenuOpen ? "block" : "hidden"
          )}
        >
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => scrollToSection("hero")}
              className={cn(
                "text-left text-base font-medium",
                activeSection === "hero"
                  ? "text-foreground/100"
                  : "text-foreground/85"
              )}
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection("demo-videos")}
              className={cn(
                "text-left text-base font-medium",
                activeSection === "demo-videos"
                  ? "text-foreground/100"
                  : "text-foreground/85"
              )}
            >
              Beneficios
            </button>
            <div className="flex flex-col space-y-2">
              <div
                className={cn(
                  "text-base font-medium",
                  activeSection === "audience-segmentation"
                    ? "text-foreground/100"
                    : "text-foreground/85"
                )}
              >
                Soluciones
              </div>
              <button
                onClick={() => scrollToSection("audience-segmentation")}
                className="ml-4 text-left text-sm text-gray-700"
              >
                Para empresas
              </button>
              <button
                onClick={() => scrollToSection("audience-segmentation")}
                className="ml-4 text-left text-sm text-gray-700"
              >
                Para educación
              </button>
              <button
                onClick={() => scrollToSection("audience-segmentation")}
                className="ml-4 text-left text-sm text-gray-700"
              >
                Personal
              </button>
            </div>
            <button
              onClick={() => scrollToSection("contact")}
              className={cn(
                "text-left text-base font-medium",
                activeSection === "contact"
                  ? "text-foreground/100"
                  : "text-foreground/85"
              )}
            >
              Contacto
            </button>
            <Button className="w-full rounded-md">Acceder</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
