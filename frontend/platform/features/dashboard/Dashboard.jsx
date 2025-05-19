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
    <div className="px-4 md:p-6  lg:px-8 min-h-[max-content]">
      <PageHeader sectionKey="dashboard" />
      <ResourceGrid categories={resourceCategories} />
      <div className="h-[max-content] md:h-[20vh] lg:h-[23vh] flex flex-col justify-center my-4 md:my-2">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 my-4 ">
          Contenido destacado
        </h2>
        <p className="text-gray-600 text-base md:text-lg">
          Explora todos los recursos disponibles para mejorar tus habilidades
          cognitivas
        </p>
      </div>
      <ResourceExploreGrid categories={resourceExplore} />
    </div>
  );
}
