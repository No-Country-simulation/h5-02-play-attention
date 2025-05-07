"use client";

import ResourceCard from "./ResourceCard";

export default function ResourceGrid({ categories }) {
  return (
    <div className="flex">
      {categories.map((category, index) => (
        <ResourceCard key={index} category={category} />
      ))}
    </div>
  );
}
