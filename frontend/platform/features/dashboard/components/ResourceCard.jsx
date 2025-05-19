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
      className={`transition-shadow !bg-[#E9E9F1] h-[max-content] w-full md:w-[max-content] md:h-[max-content]  md:p-2 lg:h-[12vh] lg:w-[21.1vw] flex border border-[#838394] rounded-sm mr-7 `}
    >
      <div className="w-16 md:w-20 flex items-center justify-center">
        {icon.type === "lucide" ? (
          <icon.component className={`w-7 md:w-8 text-${color}-600`} />
        ) : (
          <Image
            src={icon.component}
            alt={title}
            width={32}
            height={32}
            className="object-contain w-7 md:w-8"
          />
        )}
      </div>
      <CardContent className="flex flex-col justify-center !p-3">
        <CardTitle
          className={`text-lg md:text-xl text-${color}-800 mb-1 min-w-[max-content]`}
        >
          {title}
        </CardTitle>
        <CardDescription className={`text-xs text-${color}-700`}>
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
