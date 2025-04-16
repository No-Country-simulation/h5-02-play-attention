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
  title: "Play Attention",
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
  ],
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
