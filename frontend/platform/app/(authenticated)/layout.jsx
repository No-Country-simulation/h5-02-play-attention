"use client";

import { SidebarApp } from "@/shared/layout/sidebar/sidebar";
import AppHeader from "@/shared/layout/appheader/header";
import { Toaster } from "@/shared/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar";

/**
 * Layout para todas las páginas autenticadas
 * Se aplica a todas las rutas excepto login y otras públicas
 */
export default function AuthenticatedLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <SidebarProvider
        style={{
          "--sidebar-width": "18rem",
          "--sidebar-width-mobile": "16rem",
        }}
      >
        <SidebarApp/>
        {/* Contenedor principal a la derecha del sidebar */}
        <div className="flex-1 flex flex-col">
          <AppHeader>
          <SidebarTrigger />
          </AppHeader>
          <main className="flex-1 overflow-auto px-4 pt-4 pb-6 relative">
            {children}
            <Toaster />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
