/**
 * temas.js
 * ------------------------------------------------------------------
 * Única fuente de verdad de los modos de color de la galería.
 *
 * Cada tema define variables CSS que se aplican sobre <html>.
 * Los estilos (estilos.css) sólo leen esas variables, así que para
 * crear un tema nuevo basta con agregar un objeto a esta lista.
 *
 * Variables:
 *  --base          color de fondo de base
 *  --c1, --c2, --c3  manchas de color del degradé de fondo (profundidad)
 *  --borde-a/-b    degradé del marco de cada mosaico
 *  --borde-ancho   grosor del marco
 *  --sombra        color de la sombra que "levanta" los mosaicos
 *  --panel         fondo translúcido del menú y botones (efecto vidrio)
 *  --texto         color de íconos y textos de la interfaz
 *  --foco          contorno visible al navegar con teclado
 *  --visor         fondo del visor a pantalla completa
 *
 * Opciones extra:
 *  ajuste       resta columnas al mosaico → imágenes más grandes
 *  calmo        desactiva animaciones (menos distracciones)
 * ------------------------------------------------------------------
 */
export const TEMAS = [
  {
    id: 'claro',
    nombre: 'Claro pastel',
    descripcion: 'Rosa, celeste y menta. Ideal con buena luz.',
    vars: {
      '--base': '#fdf7f9',
      '--c1': '#ffd6e4',
      '--c2': '#cfe8ff',
      '--c3': '#d6f5e3',
      '--borde-a': '#ffffff',
      '--borde-b': '#f3c9dc',
      '--borde-ancho': '5px',
      '--sombra': 'rgba(176, 120, 150, 0.28)',
      '--panel': 'rgba(255, 255, 255, 0.72)',
      '--texto': '#5a4452',
      '--foco': '#d0558b',
      '--visor': 'rgba(253, 247, 249, 0.94)',
    },
  },
  {
    id: 'oscuro',
    nombre: 'Oscuro',
    descripcion: 'Índigo profundo con bordes pastel. Para la noche.',
    vars: {
      '--base': '#14121f',
      '--c1': '#3a2a5c',
      '--c2': '#1f3a52',
      '--c3': '#4a2442',
      '--borde-a': '#b9a7ff',
      '--borde-b': '#ffb3d1',
      '--borde-ancho': '3px',
      '--sombra': 'rgba(0, 0, 0, 0.55)',
      '--panel': 'rgba(30, 26, 48, 0.75)',
      '--texto': '#ece6ff',
      '--foco': '#ffb3d1',
      '--visor': 'rgba(10, 9, 16, 0.95)',
    },
  },
  {
    id: 'marron',
    nombre: 'Tierra',
    descripcion: 'Crema, caramelo y café. Cálido y tranquilo.',
    vars: {
      '--base': '#f4ebe1',
      '--c1': '#e8cfb4',
      '--c2': '#f6dfc8',
      '--c3': '#d9bfa6',
      '--borde-a': '#fff7ee',
      '--borde-b': '#b88a66',
      '--borde-ancho': '6px',
      '--sombra': 'rgba(110, 70, 40, 0.32)',
      '--panel': 'rgba(250, 240, 228, 0.78)',
      '--texto': '#5b3b25',
      '--foco': '#8a4f22',
      '--visor': 'rgba(43, 29, 19, 0.94)',
    },
  },
  {
    id: 'bosque',
    nombre: 'Bosque',
    descripcion: 'Verdes salvia y musgo. Descansa la vista.',
    vars: {
      '--base': '#eef3ec',
      '--c1': '#cfe3c8',
      '--c2': '#e3efd9',
      '--c3': '#b9d6c6',
      '--borde-a': '#f7fbf4',
      '--borde-b': '#8fb39a',
      '--borde-ancho': '5px',
      '--sombra': 'rgba(50, 90, 60, 0.28)',
      '--panel': 'rgba(240, 247, 238, 0.78)',
      '--texto': '#2f4a37',
      '--foco': '#2f7a4c',
      '--visor': 'rgba(20, 32, 24, 0.94)',
    },
  },
  {
    id: 'atardecer',
    nombre: 'Atardecer',
    descripcion: 'Lavanda y durazno. Un aire de galería contemporánea.',
    vars: {
      '--base': '#f6eef8',
      '--c1': '#e4d4f7',
      '--c2': '#ffd9c4',
      '--c3': '#f9c9d9',
      '--borde-a': '#ffffff',
      '--borde-b': '#c9b2ec',
      '--borde-ancho': '4px',
      '--sombra': 'rgba(120, 90, 160, 0.3)',
      '--panel': 'rgba(252, 246, 255, 0.72)',
      '--texto': '#4d3a66',
      '--foco': '#7a4fc2',
      '--visor': 'rgba(32, 22, 44, 0.94)',
    },
  },
  {
    id: 'penumbra',
    nombre: 'Penumbra',
    descripcion: 'Muy oscuro y cálido, sin luz azul. Para ambientes sin luz.',
    vars: {
      '--base': '#0d0907',
      '--c1': '#2a160c',
      '--c2': '#1d1009',
      '--c3': '#331b0e',
      '--borde-a': '#6b4026',
      '--borde-b': '#a8693b',
      '--borde-ancho': '2px',
      '--sombra': 'rgba(0, 0, 0, 0.7)',
      '--panel': 'rgba(26, 15, 9, 0.85)',
      '--texto': '#e3b48a',
      '--foco': '#ffb46b',
      '--visor': 'rgba(5, 3, 2, 0.97)',
    },
    // Baja levemente el brillo de las fotos para no encandilar
    filtroImagen: 'brightness(0.82) sepia(0.15)',
  },
  {
    id: 'contraste',
    nombre: 'Alto contraste',
    descripcion: 'Negro y amarillo, marcos gruesos e imágenes grandes. Para baja visión.',
    vars: {
      '--base': '#000000',
      '--c1': '#000000',
      '--c2': '#0a0a0a',
      '--c3': '#000000',
      '--borde-a': '#ffe600',
      '--borde-b': '#ffe600',
      '--borde-ancho': '6px',
      '--sombra': 'rgba(0, 0, 0, 0)',
      '--panel': '#000000',
      '--texto': '#ffe600',
      '--foco': '#00e5ff',
      '--visor': '#000000',
    },
    ajuste: 1,
    calmo: true,
  },
  {
    id: 'enfoque',
    nombre: 'Enfoque suave',
    descripcion: 'Neutro, sin animaciones y con menos imágenes por fila. Para poco enfoque.',
    vars: {
      '--base': '#f2f1ee',
      '--c1': '#e9e6df',
      '--c2': '#efede8',
      '--c3': '#e4e1d9',
      '--borde-a': '#ffffff',
      '--borde-b': '#ffffff',
      '--borde-ancho': '10px',
      '--sombra': 'rgba(60, 55, 45, 0.18)',
      '--panel': 'rgba(255, 255, 255, 0.92)',
      '--texto': '#2b2a27',
      '--foco': '#1a5fd0',
      '--visor': 'rgba(242, 241, 238, 0.98)',
    },
    ajuste: 1,
    calmo: true,
  },
];

/** Busca un tema por id (o devuelve el primero si no existe) */
export const temaPorId = (id) => TEMAS.find((t) => t.id === id) ?? TEMAS[0];
