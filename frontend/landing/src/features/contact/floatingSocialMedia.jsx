"use client";

import { useState } from "react";
import { Menu, X, Plus } from "lucide-react";

export const FloatingSocialMedia = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const socialLinks = [
    {
      name: "Instagram",
      icon: (
        <svg
          className="h-6 w-6 md:h-7 md:w-7" // Aumentado de h-5 w-5 a h-6 w-6
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M41.6427 50H8.35729C3.7577 50 0 46.2423 0 41.6427V8.35729C0 3.7577 3.7577 0 8.35729 0H41.6427C46.2423 0 50 3.7577 50 8.35729V41.6427C50 46.2628 46.2628 50 41.6427 50Z"
            fill="#5C3983"
          />
          <path
            d="M25.0104 37.8439C21.5813 37.8439 18.3575 36.5092 15.9345 34.0862C13.5115 31.6632 12.1768 28.4393 12.1768 25.0102C12.1768 21.581 13.5115 18.3572 15.9345 15.9342C18.3575 13.5112 21.5813 12.1765 25.0104 12.1765C28.4396 12.1765 31.6634 13.5112 34.0864 15.9342C36.5094 18.3572 37.8441 21.581 37.8441 25.0102C37.8441 28.4393 36.5094 31.6632 34.0864 34.0862C31.6429 36.5092 28.4396 37.8439 25.0104 37.8439ZM25.0104 14.9075C19.4458 14.9075 14.9078 19.425 14.9078 25.0102C14.9078 30.5749 19.4252 35.1129 25.0104 35.1129C30.5751 35.1129 35.1131 30.5954 35.1131 25.0102C35.0926 19.4455 30.5751 14.9075 25.0104 14.9075Z"
            fill="#F5F5F5"
          />
          <path
            d="M40.3455 11.7548C41.7064 11.7548 42.8096 10.6516 42.8096 9.2907C42.8096 7.9298 41.7064 6.82657 40.3455 6.82657C38.9846 6.82657 37.8813 7.9298 37.8813 9.2907C37.8813 10.6516 38.9846 11.7548 40.3455 11.7548Z"
            fill="#F5F5F5"
          />
        </svg>
      ),
      url: "https://instagram.com/tu_usuario",
      color: "hover:bg-white",
    },
    {
      name: "WhatsApp",
      icon: (
        <svg
          className="h-6 w-6 md:h-7 md:w-7" // Aumentado de h-5 w-5 a h-6 w-6
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M48.0428 14.3089C46.779 11.5164 44.965 9.00928 42.6617 6.84869C40.3584 4.70847 37.6882 3.01668 34.7123 1.83447C31.6345 0.61149 28.3732 0 25.01 0C21.6468 0 18.3855 0.61149 15.3077 1.83447C12.3317 3.01668 9.66156 4.68809 7.35828 6.84869C5.055 9.00928 3.24094 11.5164 1.97719 14.3089C0.672679 17.2033 0 20.3015 0 23.4812C0 29.0458 2.07905 34.3861 5.89067 38.6258L3.85237 49.7345L14.6962 44.9037C17.9371 46.2898 21.3818 46.9828 24.9896 46.9828C28.3528 46.9828 31.6141 46.3713 34.6919 45.1483C37.6678 43.9661 40.338 42.2947 42.6413 40.1341C44.9445 37.9735 46.7586 35.4664 48.0224 32.6739C49.3269 29.7796 49.9995 26.6813 49.9995 23.5016C50.0199 20.3015 49.3473 17.2236 48.0428 14.3089Z"
            fill="#5C3983"
          />
          <path
            d="M35.1609 28.1691C34.101 27.6391 33.3265 27.313 32.7762 27.1092C32.4296 26.9869 31.6143 26.62 31.3289 26.8442C30.4321 27.578 29.4741 29.657 28.4549 30.0443C25.9274 29.5551 23.5834 27.8226 21.7489 26.0493C20.9336 25.2747 19.4253 23.0733 19.0991 22.4822C19.038 21.8707 20.1386 21.0554 20.3832 20.5866C21.647 19.1598 20.689 18.263 20.526 17.6718C20.2406 17.0604 19.7514 15.9597 19.3234 15.0628C18.9565 14.4717 18.8749 13.5952 18.2226 13.2691C15.4505 11.8423 13.8607 14.6959 13.2085 16.1839C9.27456 25.662 32.9188 43.7009 37.7292 31.2673C37.9738 30.187 37.8718 29.7793 37.505 29.2902C36.7712 28.7806 35.9151 28.5564 35.1609 28.1691Z"
            fill="#DEDEDE"
          />
        </svg>
      ),
      url: "https://wa.me/tunumerodewhatsapp",
      color: "hover:bg-white",
    },
  ];

  return (
    <div className="  fixed right-4 bottom-4 md:right-5 md:bottom-5 z-50 flex flex-col items-end gap-2 md:gap-6">
      {/* Menú desplegable */}
      <div
        className={`flex flex-col gap-2 md:gap-6 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8 pointer-events-none"
        }`}
      >
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            className={`w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg shadow-[#C5C5D9] flex items-center justify-center bg-white backdrop-blur-sm border border-gray-200 transition-colors ${link.color} text-gray-700`} // Aumentado de w-12 h-12 a w-14 h-14
          >
            {link.icon}
          </a>
        ))}
      </div>

      {/* Botón hamburguesa */}
      <button
        onClick={toggleMenu}
        className="w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg bg-[#5C3983] hover:bg-[#C5C5D9] hover: transition-all flex items-center justify-center text-white" // Aumentado de w-12 h-12 a w-14 h-14
        aria-label={
          isOpen ? "Cerrar menú redes sociales" : "Abrir menú redes sociales"
        }
      >
        {isOpen ? (
          <X className="h-6 w-6 md:h-7 md:w-7" /> // Aumentado de h-5 w-5 a h-6 w-6
        ) : (
          <Menu className="h-6 w-6 md:h-7 md:w-7" /> // Aumentado de h-5 w-5 a h-6 w-6
        )}
      </button>
    </div>
  );
};
