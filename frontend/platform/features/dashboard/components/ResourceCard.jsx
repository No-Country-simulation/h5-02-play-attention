"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/ui/card";
import Image from "next/image";

export default function ResourceCard({ category }) {
  const { title, description, icon, path, color } = category;

  return (
    <Card
      className={`hover:shadow-md transition-shadow !bg-[#E9E9F1] h-[12vh] w-[21.1vw] mr-7 flex border border-[#838394] rounded-sm`}
    >
      <div className={`w-20 flex items-center justify-center `}>
        {icon.type === "lucide" ? (
          <icon.component className={`w-8 h-8 text-${color}-600`} />
        ) : (
          <Image
            src={icon.component}
            alt={title}
            width={32}
            height={32}
            className="object-contain"
          />
        )}
      </div>
      <CardContent className="flex flex-col justify-center h-full w-full !p-0">
        <CardTitle className={`text-xl text-${color}-800 mb-1`}>
          {title}
        </CardTitle>
        <CardDescription className={`text-xs text-${color}-700`}>
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
