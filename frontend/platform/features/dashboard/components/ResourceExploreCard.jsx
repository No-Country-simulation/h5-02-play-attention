"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export default function ResourceExploreCard({ category }) {
  const { title, description, icon: Icon, path, color } = category;

  return (
    <Card className="hover:shadow-md transition-shadow w-[13.8vw] h-[26.9vh] mr-4 p-4 border border-[#C6C6DA] rounded-sm flex flex-col ">
      <div className="bg-[#E9E9F1] p-1">
        <Icon className="h-5 w-5 stroke-[#15032A]" />
      </div>
      <CardHeader className="!p-0 mt-2">
        <CardTitle className="!text-[1rem]">{title}</CardTitle>
      </CardHeader>

      <CardContent className={"!p-0  mt-2"}>
        <CardDescription className="text-xs text-[#A7A7BE] ">
          {description}
        </CardDescription>
      </CardContent>
      <Link
        href={path}
        className="inline-block  text-[#15032A] hover:underline text-xs mt-auto"
      >
        <b>Explorar →</b>
      </Link>
    </Card>
  );
}
