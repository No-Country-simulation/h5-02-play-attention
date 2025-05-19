"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export function BackgroundShapes({ className = "" }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });

  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        setDimensions({
          width: containerRef.current?.offsetWidth || 0,
          height: containerRef.current?.offsetHeight || 0,
        });
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Forma superior - púrpura claro */}
      <motion.div
        className="absolute -top-[10%] -right-[10%] w-[70%] h-[60%] bg-secondary-400 rounded-[40%_60%_60%_40%/60%_30%_70%_40%]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Forma inferior - gris claro */}
      <motion.div
        className="absolute -bottom-[10%] -left-[10%] w-[70%] h-[60%] bg-[#E5E2E5] rounded-[40%_60%_60%_40%/60%_30%_70%_40%]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
      />

      {/* Círculo pequeño superior derecha */}
      <motion.div
        className="absolute right-[10%] top-[55%] w-[40px] h-[40px] rounded-full bg-secondary-300"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      />

      {/* Círculo pequeño inferior izquierda */}
      <motion.div
        className="absolute left-[10%] top-[30%] w-[56px] h-[53px] rounded-full bg-secondary-600"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}