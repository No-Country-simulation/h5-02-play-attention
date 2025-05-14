import { FloatingSocialMedia } from "@/features/contact/floatingSocialMedia";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar/navbar";

import dynamic from "next/dynamic";

export const metadata = {
  title: "Play Attention Argentina - Proveedores Certificados",
  description:
    "Programa con tecnología BrainAware™ para potenciar habilidades cognitivas y funciones ejecutivas. Ideal para personas con TDAH, profesionales, instituciones educativas y empresas.",
  keywords: [
    "TDAH",
    "atención",
    "entrenamiento cerebral",
    "cognición",
    "funciones ejecutivas",
    "BrainAware",
    "Play Attention",
    "mejorar concentración",
    "estimulación cognitiva",
    "tecnología NASA",
    "landing page educativa",
    "Argentina",
  ],
  authors: [{ name: "Play Attention ARG" }],
  creator: "Play Attention ARG",
  publisher: "Play Attention ARG",

  openGraph: {
    title: "Play Attention",
    description:
      "Descubrí cómo Play Attention mejora la atención y el rendimiento cognitivo con tecnología basada en la NASA.",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "Persona mostrando el sistema Play Attention",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Play Attention",
    description:
      "Tecnología para potenciar habilidades cognitivas. Ideal para personas con TDAH y entornos educativos.",
    images: [
      {
        url: "/hero.png",
        alt: "Persona utilizando Play Attention en un entorno educativo",
      },
    ],
  },
};

export default function LandingLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <FloatingSocialMedia />
      <Footer />
    </>
  );
}
