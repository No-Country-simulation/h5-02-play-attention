import { Navbar } from "@/features/audience-segmentation/individuals/navbar/navbar";
import { FloatingSocialMedia } from "@/features/contact/floatingSocialMedia";
import { Footer } from "@/shared/components/footer";

export const metadata = {
  title: "Play Attention Argentina | Personas",
  description:
    "Descubrí cómo la tecnología BrainAware™ basada en la NASA ayuda a adultos, adolescentes y padres a mejorar su atención, concentración y funciones ejecutivas. Ahora en Argentina.",
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
    "adultos con TDAH",
    "adolescentes con TDAH",
    "padres y TDAH",
    "solución TDAH Argentina",
  ],
  authors: [{ name: "Play Attention ARG" }],
  creator: "Play Attention ARG",
  publisher: "Play Attention ARG",

  openGraph: {
    title: "TDAH bajo tu control | Play Attention Argentina",
    description:
      "Tecnología de la NASA ahora disponible en Argentina. Solución personalizada para adultos, adolescentes y padres con TDAH.",
    images: [
      {
        url: "/individuals/hero.png",
        width: 1200,
        height: 630,
        alt: "Persona usando el dispositivo Play Attention",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "TDAH bajo tu control | Play Attention Argentina",
    description:
      "Entrenamiento con tecnología de la NASA para mejorar atención y funciones ejecutivas. Para adultos, adolescentes y padres.",
    images: [
      {
        url: "/individuals/hero.png",
        alt: "Persona usando el sistema Play Attention en Argentina",
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
