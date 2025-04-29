"use client";

import { useState, useEffect } from "react";
import NavbarDesktop from "./navbar-desktop";
import NavbarMobile from "./navbar-mobile";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    const navbarHeight = 56;

    if (element) {
      const offsetTop = element.offsetTop;

      const scrollTo = sectionId === "hero" ? 0 : offsetTop - navbarHeight;

      window.scrollTo({
        top: scrollTo,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero",
        "operation",
        "benefits",
        "testimonials",
        "faq",
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
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-neutral-white-500 py-3 px-4 lg:px-20">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="text-2xl font-bold text-secondary cursor-pointer"
        >
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-8 w-auto block lg:hidden xl:block"
          />

          <img
            src="/logo-dipper.svg"
            alt="Logo"
            className="h-8 w-auto hidden lg:block xl:hidden"
          />
        </button>

        <NavbarDesktop
          scrollToSection={scrollToSection}
          activeSection={activeSection}
        />

        <NavbarMobile
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          scrollToSection={scrollToSection}
          activeSection={activeSection}
        />
      </div>
    </nav>
  );
}
