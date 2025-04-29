import { cn } from "@/lib/utils";
import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";

export default function NavbarDesktop({ scrollToSection, activeSection }) {
  const router = useRouter();
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
        onClick={() => scrollToSection("operation")}
        variant="link"
        className={cn(
          activeSection === "operation" ? "underline" : "underline-offset-4"
        )}
      >
        Funcionamiento
      </Button>
      <Button
        onClick={() => scrollToSection("benefits")}
        variant="link"
        className={cn(
          activeSection === "benefits" ? "underline" : "underline-offset-4"
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
        onClick={() => scrollToSection("faq")}
        variant="link"
        className={cn(
          activeSection === "faq" ? "underline" : "underline-offset-4"
        )}
      >
        FAQ
      </Button>
      <Button className="rounded-md" onClick={() => scrollToSection("contact")}>
        Contacto
      </Button>
    </div>
  );
}
