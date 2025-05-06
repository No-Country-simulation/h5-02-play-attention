"use client";

import PageHeader from "@/shared/layout/sectionheader/pageHeader";
import ResourceGrid from "./components/ResourceGrid";
import { useResourceCategories } from "./hooks/useResourceCategories";
import { useResourceExplore } from "./hooks/useResourceExplore";
import ResourceExploreGrid from "./components/ResourceExploreGrid";

export default function DashboardPage() {
  const resourceCategories = useResourceCategories();
  const resourceExplore = useResourceExplore();

  return (
    <div className="px-7">
      <PageHeader sectionKey="dashboard" />
      <ResourceGrid categories={resourceCategories} />
      <div className="h-[23.2vh]  flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-2">Contenido destacado</h2>
        <p className="text-gray-600 text-lg">
          Explora todos los recursos disponibles para mejorar tus habilidades
          cognitivas
        </p>
      </div>
      <ResourceExploreGrid categories={resourceExplore} />
    </div>
  );
}
