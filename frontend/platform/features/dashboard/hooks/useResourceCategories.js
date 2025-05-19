import {
  FileText,
  Video,
  BookOpen,
  Images,
  PenTool,
  MessageCircle,
  Settings,
} from "lucide-react";
import mindfullness from "../icons/mindfulness.svg";
import network from "../icons/network_intel_node.svg";
import bulb from "../icons/lightbulb_2.svg";

export function useResourceCategories() {
  const resourceCategories = [
    {
      title: "Enfoca tu atención",
      description: "Enfoca tu atención",
      icon: {
        type: "svg",
        component: mindfullness,
      },
      path: "/educational-material",
      color: "blue",
    },
    {
      title: "Enfoca tu atención",
      description: "Enfoca tu atención",
      icon: {
        type: "svg",
        component: network,
      },
      path: "/educational-material",
      color: "blue",
    },
    {
      title: "Enfoca tu atención",
      description: "Enfoca tu atención",
      icon: {
        type: "svg",
        component: bulb,
      },
      path: "/educational-material",
      color: "blue",
    },
  ];

  return resourceCategories;
}
