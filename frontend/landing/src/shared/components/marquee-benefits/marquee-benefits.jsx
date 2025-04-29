"use client";

import { Marquee } from "@/shared/ui/marquee";

export function MarqueeBenefits({ benefits }) {
  return (
    <div className="relative w-full overflow-hidden bg-secondary-500 py-2">
      <Marquee pauseOnHover className="[--duration:30s]">
        {benefits.map((benefit, index) => (
          <BenefitItem key={index} text={benefit.text} />
        ))}
      </Marquee>
    </div>
  );
}

function BenefitItem({ text }) {
  return (
    <div className="flex items-center mx-4">
      <div className="h-2 w-2 rounded-full bg-primary-200 mr-2" />
      <p className="text-sm font-medium text-gray-800">{text}</p>
    </div>
  );
}
