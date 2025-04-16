import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/shared/providers/react-query-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Play Attention Argentina",
  description:
    "Programa de neuroentrenamiento con tecnología BrainAware™ para potenciar habilidades cognitivas y funciones ejecutivas. Ideal para personas con TDAH, profesionales, instituciones educativas y empresas.",
  keywords: [
    "TDAH",
    "neurofeedback",
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
        alt: "Persona usando el sistema Play Attention con un casco neurotecnológico",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Play Attention",
    description:
      "Tecnología de neurofeedback para potenciar habilidades cognitivas. Ideal para personas con TDAH y entornos educativos.",
    images: [
      {
        url: "/hero.png",
        alt: "Persona utilizando Play Attention en un entorno educativo",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          {children}
          <ReactQueryDevtools />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
