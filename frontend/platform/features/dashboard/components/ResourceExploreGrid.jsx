"use client";

import ResourceExploreCard from "./ResourceExploreCard";

export default function ResourceExploreGrid({ categories }) {
  return (
    <div className="flex">
      {categories.map((category, index) => (
        <ResourceExploreCard key={index} category={category} />
      ))}
    </div>
  );
}
