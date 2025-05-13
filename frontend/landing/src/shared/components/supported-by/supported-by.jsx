"use client";

import { Marquee } from "@/shared/ui/marquee";

export function MarqueeSupportedBy({ logos }) {
  return (
    <div className="relative w-full overflow-hidden py-16">
      <div className="text-3xl font-semibold text-primary-900 text-center mb-8">
        Avalado por
      </div>
      <Marquee pauseOnHover className="[--duration:40s]">
        {logos.map((logo, index) => (
          <LogoItem key={index} {...logo} />
        ))}
      </Marquee>
    </div>
  );
}

function LogoItem({ src, alt }) {
  return (
    <div className="flex items-center mx-8 h-12">
      <img 
        src={src} 
        alt={alt} 
        className="max-h-full max-w-[120px] object-contain grayscale hover:grayscale-0 transition-all"
      />
    </div>
  );
}