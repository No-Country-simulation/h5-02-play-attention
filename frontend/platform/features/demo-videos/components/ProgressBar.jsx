"use client"

import { useEffect, useState } from "react";

export function ProgressBar({ progress, color = "bg-primary" }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Pequeño retraso para asegurar que la animación se vea
    const timer = setTimeout(() => {
      setWidth(progress)
    }, 100)

    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className="w-full px-1">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Progreso</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
} 