import { Navbar } from "@/features/audience-segmentation/professionals/navbar/navbar";
import { FloatingSocialMedia } from "@/features/contact/floatingSocialMedia";
import { Footer } from "@/shared/components/footer";

export const metadata = {
  title: "Play Attention Argentina | Profesionales de la Salud Mental",
  description:
    "Neurotecnología clínicamente validada para mejorar el rendimiento de los profesionales de la salud mental. Herramientas avanzadas para psicólogos, neurólogos y educadores, desde detección temprana hasta informes de progreso automatizados.",
  keywords: [
    "neurotecnología",
    "salud mental",
    "psicólogos",
    "neurólogos",
    "educadores",
    "atención",
    "neurofeedback",
    "tecnología avanzada",
    "diagnóstico temprano",
    "informes de progreso",
    "BrainAware",
    "Play Attention",
    "tecnología NASA",
    "funciones ejecutivas",
    "rendimiento cognitivo",
  ],
  authors: [{ name: "Play Attention ARG" }],
  creator: "Play Attention ARG",
  publisher: "Play Attention ARG",

  openGraph: {
    title:
      "Neurotecnología para Profesionales de la Salud Mental | Play Attention Argentina",
    description:
      "Herramientas validadas científicamente para psicólogos, neurólogos y educadores, desde la detección temprana hasta informes de progreso automatizados, basadas en la tecnología BrainAware™ de la NASA.",
    images: [
      {
        url: "/professionals/hero.png",
        width: 1200,
        height: 630,
        alt: "Profesionales de la salud mental utilizando Play Attention",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Neurotecnología para Profesionales de la Salud Mental | Play Attention Argentina",
    description:
      "Tecnología avanzada para mejorar atención y funciones ejecutivas, diseñada para psicólogos, neurólogos y educadores. Validadas científicamente para un mejor diagnóstico y tratamiento.",
    images: [
      {
        url: "/professionals/hero.png",
        alt: "Profesionales potenciando su enfoque con Play Attention",
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
