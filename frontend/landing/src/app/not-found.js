"use client"

import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Grid background */}
      <div className="absolute inset-0 bg-background bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[length:50px_50px] opacity-30"></div>

      {/* Glow effects */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-primary opacity-10 blur-[100px] top-[20%] left-[10%]"></div>
      <div className="absolute w-[300px] h-[300px] rounded-full bg-primary opacity-10 blur-[100px] bottom-[10%] right-[5%]"></div>

      <main className="text-center p-8 max-w-md relative z-10">
        {/* Error code */}
        <h1 className="text-9xl font-black bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-2xl font-bold mt-4 mb-2">Página no encontrada</h2>
        <p className="mb-8 text-muted-foreground">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Button variant="secondary" onClick={() => window.history.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <Button asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>

        {/* Brand */}
        <div className="mt-16 animate-pulse">
          <p className="font-bold text-xl">Play Attention</p>
          <p className="text-sm text-muted-foreground">Mantente enfocado, mantente productivo</p>
        </div>
      </main>
    </div>
  )
}
