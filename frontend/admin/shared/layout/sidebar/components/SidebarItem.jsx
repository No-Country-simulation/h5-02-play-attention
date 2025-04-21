import Link from 'next/link';

/**
 * Componente que renderiza un ítem individual del sidebar
 * Versión moderna con mejores transiciones y efectos visuales
 * Adaptado al design system con la paleta de colores púrpura
 */
export default function SidebarItem({
  item,
  active,
  expanded,
  highlighted = false
}) {
  const Icon = item.icon;

  return (
    <li>
      <Link
        href={item.path}
        className={`flex items-center p-2 rounded-md transition-all duration-200 ${
          active
            ? 'bg-[#5b21b6] text-white font-medium' // Púrpura más intenso para ítem activo (basado en design system)
            : highlighted
            ? 'text-[#c4b5fd] hover:bg-[#4c1d95]/20 hover:text-white' // Color púrpura claro para destacados
            : 'text-white/70 hover:bg-[#4c1d95]/15 hover:text-white' // Púrpura muy oscuro para hover
        } focus:outline-none focus:ring-0 relative group ${
          highlighted && expanded ? 'font-medium' : ''
        }`}
        aria-label={item.name}
        aria-current={active ? 'page' : undefined}
      >
        {Icon && (
          <div
            className={`w-7 h-7 flex justify-center items-center transition-colors ${
              active ? 'text-white' : 'text-white/70'
            }`}
          >
            <Icon
              className={`${
                highlighted ? 'h-[19px] w-[19px]' : 'h-[18px] w-[18px]'
              } ${expanded ? 'mr-3' : ''}`}
            />
          </div>
        )}
        {expanded && (
          <span
            className={`truncate text-[14px] leading-[1.4] ${
              active ? 'font-medium' : 'font-normal'
            } ${highlighted ? 'tracking-normal' : ''}`}
          >
            {item.name}
          </span>
        )}
      </Link>
    </li>
  );
}
