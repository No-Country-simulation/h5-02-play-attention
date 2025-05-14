import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/shared/providers/react-query-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata = {
  title: "Play Attention Argentina",
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${robotoMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          {children}
          <ReactQueryDevtools />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
