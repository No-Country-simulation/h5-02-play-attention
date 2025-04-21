import Link from 'next/link';

/**
 * Componente que renderiza un ítem individual del sidebar
 * Versión moderna con mejores transiciones y efectos visuales
 */
export default function SidebarItem({
  item,
  active,
  expanded,
  highlighted = false,
  isMobile = false
}) {
  const Icon = item.icon;

  // Estilos personalizados para crear contrastes con el violeta oscuro
  const darkPurpleWithOpacity = 'rgba(30, 3, 57, 0.8)';

  return (
    <li>
      <Link
        href={item.path}
        className={`flex items-center p-2 rounded-md transition-all duration-200 ${
          active
            ? 'bg-sidebar-accent/30 text-white font-medium'
            : highlighted
            ? 'text-sidebar-accent hover:bg-sidebar-border/15 hover:text-white'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-border/10 hover:text-sidebar-foreground'
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
            style={!active ? { filter: 'brightness(0.7) saturate(1.2)' } : {}}
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
            className={`truncate ${isMobile ? 'text-[15px]' : 'text-sm'} ${
              highlighted ? 'tracking-wide' : ''
            }`}
          >
            {item.name}
          </span>
        )}
      </Link>
    </li>
  );
}
