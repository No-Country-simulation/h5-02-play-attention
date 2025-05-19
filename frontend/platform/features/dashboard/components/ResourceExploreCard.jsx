"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export default function ResourceExploreCard({ category }) {
  const { title, description, icon: Icon, path } = category;

  return (
    <Card className="hover:shadow-md transition-shadow h-48 md:h-64 p-4 border border-[#C6C6DA] rounded-sm flex flex-col !bg-[#F8F8FA]">
      <div className="bg-[#DEDEEA] p-1 w-full h-8 flex items-center justify-center">
        <Image
          src={Icon}
          alt={title}
          width={20}
          height={20}
          className="text-[#15032A]"
        />
      </div>
      <CardHeader className="!p-0 mt-3">
        <CardTitle className="!text-sm md:!text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="!p-0 mt-2">
        <CardDescription className="text-xs text-[#A7A7BE]">
          {description}
        </CardDescription>
      </CardContent>
      <Link
        href={path}
        className="inline-block text-[#15032A] hover:underline text-xs mt-auto pt-2"
      >
        <b>Explorar →</b>
      </Link>
    </Card>
  );
}
