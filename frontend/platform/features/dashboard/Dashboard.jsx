"use client";

import PageHeader from "@/shared/layout/sectionheader/pageHeader";
import ResourceGrid from "./components/ResourceGrid";
import { useResourceCategories } from "./hooks/useResourceCategories";

export default function DashboardPage() {
  const resourceCategories = useResourceCategories();

  return (
    <div className="p-8">
      <PageHeader sectionKey="dashboard" />
      <ResourceGrid categories={resourceCategories} />
    </div>
  );
}
