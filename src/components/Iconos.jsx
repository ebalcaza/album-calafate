/**
 * Iconos.jsx — íconos SVG dibujados a mano (sin librerías externas).
 * Usan "currentColor", así toman el color del tema automáticamente.
 * aria-hidden: son decorativos; el texto accesible va en el botón.
 */
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const IconoCerrar = () => (
  <svg {...base}><path d="M6 6l12 12M18 6L6 18" /></svg>
);

export const IconoAnterior = () => (
  <svg {...base}><path d="M15 5l-7 7 7 7" /></svg>
);

export const IconoSiguiente = () => (
  <svg {...base}><path d="M9 5l7 7-7 7" /></svg>
);

export const IconoLupaMas = () => (
  <svg {...base}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2M11 8v6M8 11h6" /></svg>
);

export const IconoLupaMenos = () => (
  <svg {...base}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2M8 11h6" /></svg>
);

/** Paleta de pintor: abre el menú de temas */
export const IconoPaleta = () => (
  <svg {...base}>
    <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z" />
    <circle cx="7.5" cy="11" r="1.2" fill="currentColor" />
    <circle cx="10" cy="7" r="1.2" fill="currentColor" />
    <circle cx="14.5" cy="7" r="1.2" fill="currentColor" />
    <circle cx="17" cy="10.5" r="1.2" fill="currentColor" />
  </svg>
);

/** Cuadrícula chica / grande: controles de tamaño del mosaico */
export const IconoMasChico = () => (
  <svg {...base}>
    <rect x="3" y="3" width="5" height="5" rx="1" /><rect x="9.5" y="3" width="5" height="5" rx="1" /><rect x="16" y="3" width="5" height="5" rx="1" />
    <rect x="3" y="9.5" width="5" height="5" rx="1" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><rect x="16" y="9.5" width="5" height="5" rx="1" />
    <rect x="3" y="16" width="5" height="5" rx="1" /><rect x="9.5" y="16" width="5" height="5" rx="1" /><rect x="16" y="16" width="5" height="5" rx="1" />
  </svg>
);

export const IconoMasGrande = () => (
  <svg {...base}>
    <rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" />
  </svg>
);
