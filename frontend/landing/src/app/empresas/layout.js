import { Navbar } from "@/features/audience-segmentation/companies/navbar/navbar";
import { Footer } from "@/shared/components/footer";

export const metadata = {
  title: "Play Attention Argentina | Soluciones Corporativas",
  description:
    "Impulsá el rendimiento de tus equipos con herramientas científicas basadas en la tecnología BrainAware™ de la NASA. Aplicable en empresas, instituciones educativas y organizaciones deportivas.",
  keywords: [
    "TDAH",
    "neurofeedback",
    "desempeño laboral",
    "educación",
    "deporte",
    "atención",
    "entrenamiento cognitivo",
    "BrainAware",
    "Play Attention",
    "tecnología NASA",
    "salud mental corporativa",
    "productividad",
    "funciones ejecutivas",
    "rendimiento académico",
    "burnout",
  ],
  authors: [{ name: "Play Attention ARG" }],
  creator: "Play Attention ARG",
  publisher: "Play Attention ARG",

  openGraph: {
    title: "Soluciones para Empresas y Educación | Play Attention Argentina",
    description:
      "Herramientas validadas científicamente para instituciones educativas, empresas y organizaciones deportivas. Mejorá atención, enfoque y rendimiento.",
    images: [
      {
        url: "/corporativo/hero.png",
        width: 1200,
        height: 630,
        alt: "Equipo de trabajo usando Play Attention",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Soluciones para Empresas y Educación | Play Attention Argentina",
    description:
      "Neuroentrenamiento con tecnología de la NASA para mejorar atención y funciones ejecutivas en equipos corporativos, docentes y deportistas.",
    images: [
      {
        url: "/corporativo/hero.png",
        alt: "Colaboradores potenciando su enfoque con Play Attention",
      },
    ],
  },
};

export default function LandingLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
