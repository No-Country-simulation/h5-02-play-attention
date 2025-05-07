import {
  FileText,
  Video,
  BookOpen,
  Images,
  PenTool,
  MessageCircle,
  Settings,
} from "lucide-react";

export function useResourceCategories() {
  const resourceCategories = [
    {
      title: "Enfoca tu atención",
      description: "Enfoca tu atención",
      icon: FileText,
      path: "/educational-material",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Enfoca tu atención",
      description: "Enfoca tu atención",
      icon: FileText,
      path: "/educational-material",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Enfoca tu atención",
      description: "Enfoca tu atención",
      icon: FileText,
      path: "/educational-material",
      color: "bg-blue-100 text-blue-700",
    },
  ];

  return resourceCategories;
}
