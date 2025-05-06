"use client";

import { useMaterials } from "./hooks/useMaterials";
import SearchBar from "./components/SearchBar";
import MaterialList from "./components/MaterialList";
import PageHeader from "@/shared/layout/sectionheader/pageHeader";

export default function EducationalMaterialPage() {
  const { materials, searchQuery, setSearchQuery } = useMaterials();

  return (
    <div className="p-8">
      <div className="flex flex-col  mb-6">
        <PageHeader sectionKey="materialEducativo" />{" "}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <p className="text-gray-600 mb-8">
        Accede a documentos, presentaciones y guías que te ayudarán a entender y
        aprovechar al máximo Play Attention.
      </p>

      <MaterialList materials={materials} />
    </div>
  );
}
