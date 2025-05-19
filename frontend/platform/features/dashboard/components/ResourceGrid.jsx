"use client";
import ResourceCard from "./ResourceCard";

export default function ResourceGrid({ categories }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:flex gap-4 my-4 md:my-10 lg:m-0 ">
      {categories.map((category, index) => (
        <ResourceCard key={index} category={category} />
      ))}
    </div>
  );
}
