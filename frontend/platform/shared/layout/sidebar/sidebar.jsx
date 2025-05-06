"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  Video,
  BookOpen,
  PenTool,
  MessageCircle,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { UserMenu } from "@/features/auth";

export function SidebarApp() {
  const [showContentItems, setShowContentItems] = useState(false);

  // Orden de los items principales
  const mainItems = [
    { name: "Panel de control", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Actividades", icon: PenTool, path: "/activities" },
    { name: "Soporte", icon: MessageCircle, path: "/support" },
  ];

  // Items de contenido que se mostrarán/ocultarán
  const contentItems = [
    {
      name: "Material educativo",
      icon: FileText,
      path: "/educational-material",
    },
    { name: "Tutoriales", icon: Video, path: "/tutorials" },
    { name: "Artículos médicos", icon: BookOpen, path: "/medical-articles" },
    { name: "Videos de demostración", icon: Video, path: "/demo-videos" },
  ];

  return (
    <Sidebar variant="default" className="text-xl">
      <SidebarHeader className="flex justify-start items-start">
        <Image
          src="/svgs/logos/logo.svg"
          width={280}
          height={64}
          className="w-fit px-2 h-12 mb-8"
          alt="Logo"
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="space-y-1 p-2">
          {/* 1. Panel de control (siempre visible) */}
          <SidebarMenuItem>
            <Link href="/dashboard" className="w-full">
              <SidebarMenuButton className="px-4 h-11 w-full justify-start">
                <LayoutDashboard className="w-5 h-5 mr-3" />
                <span>Panel de control</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          {/* 2. Contenido (con funcionalidad expandible) */}
          <SidebarMenuItem>
            <div
              onClick={() => setShowContentItems(!showContentItems)}
              className="w-full cursor-pointer"
            >
              <SidebarMenuButton className="px-4 h-11 w-full justify-between">
                <div className="flex items-center">
                  <Newspaper className="w-4 h-4 mr-4" />
                  <span>Contenido</span>
                </div>
                {showContentItems ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </SidebarMenuButton>
            </div>
          </SidebarMenuItem>

          {/* Items de contenido (aparecen/desaparecen) */}
          {showContentItems &&
            contentItems.map((item, index) => (
              <SidebarMenuItem key={`content-${index}`}>
                <Link href={item.path} className="w-full">
                  <SidebarMenuButton className="px-4 h-11 w-full justify-start">
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}

          {/* 3. Resto de items principales */}
          {mainItems.slice(1).map((item, index) => (
            <SidebarMenuItem key={`main-${index}`}>
              <Link href={item.path} className="w-full">
                <SidebarMenuButton className="px-4 h-11 w-full justify-start">
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-200 flex md:hidden w-full">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
