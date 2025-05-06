"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Lightbulb } from "lucide-react";

export default function ResourceCard({ category }) {
  const { title, description, icon: Icon, path, color } = category;

  return (
    <Card className="hover:shadow-md transition-shadow !bg-[#E9E9F1] h-[12vh] w-[21.1vw] mr-7 flex border border-[#838394] rounded-sm">
      <div className={`w-20 flex items-center justify-center`}>
        <Lightbulb className="h-[50%] w-auto stroke-[#15032A] " />
      </div>
      <CardContent className="flex flex-col justify-center h-full w-full !p-0">
        <CardTitle className="text-xl text-[#15032A] mb-1">{title}</CardTitle>
        <CardDescription className="text-xs text-[#656573]-500">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
