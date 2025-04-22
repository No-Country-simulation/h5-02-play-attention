import { Button } from "../../ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

export default function NavbarDesktop({ scrollToSection, activeSection }) {
  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Button
        onClick={() => scrollToSection("hero")}
        variant="link"
        className={cn(
          activeSection === "hero" ? "underline" : "underline-offset-4"
        )}
      >
        Inicio
      </Button>
      <Button
        onClick={() => scrollToSection("demo-videos")}
        variant="link"
        className={cn(
          activeSection === "demo-videos" ? "underline" : "underline-offset-4"
        )}
      >
        Funcionamiento
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="link"
            className={cn(
              "flex items-center gap-1",
              activeSection === "audience-segmentation"
                ? "underline"
                : "underline-offset-4"
            )}
          >
            Soluciones <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={(e) =>  {
              e.preventDefault();
              scrollToSection("audience-segmentation")}}
          >
            Para empresas
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) =>  {
              e.preventDefault();
              scrollToSection("audience-segmentation")}}
          >
            Para educación
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) =>  {
              e.preventDefault();
              scrollToSection("audience-segmentation")}}
          >
            Personal
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        onClick={() => scrollToSection("pricing-plans")}
        variant="link"
        className={cn(
          activeSection === "pricing-plans" ? "underline" : "underline-offset-4"
        )}
      >
        Beneficios
      </Button>
      <Button
        onClick={() => scrollToSection("testimonials")}
        variant="link"
        className={cn(
          activeSection === "testimonials" ? "underline" : "underline-offset-4"
        )}
      >
        Testimonios
      </Button>
      <Button
        onClick={() => scrollToSection("about-us")}
        variant="link"
        className={cn(
          activeSection === "about-us" ? "underline" : "underline-offset-4"
        )}
      >
        Sobre nosotros
      </Button>
      <Button className="rounded-md" onClick={() => scrollToSection("contact")}>Contacto</Button>
    </div>
  );
}
