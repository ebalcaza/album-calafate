/**
 * Galeria.jsx — el mosaico de imágenes.
 * ------------------------------------------------------------------
 * Usa CSS Grid con "grid-auto-flow: dense": el navegador acomoda las
 * piezas de distintos tamaños rellenando los huecos automáticamente.
 *
 * La cantidad de columnas se calcula según el ANCHO REAL del contenedor
 * (no de la ventana), medido con un ResizeObserver. Así:
 *   - celular       → 2 columnas
 *   - tablet        → 3 a 4 columnas
 *   - escritorio    → 5 a 6 columnas
 * y el alto de cada fila es igual al ancho de una columna, por lo que
 * las piezas "normales" quedan perfectamente cuadradas.
 * ------------------------------------------------------------------
 */
import { useLayoutEffect, useRef, useState } from 'react';
import Mosaico from './Mosaico.jsx';

/** Columnas base según el ancho disponible (en píxeles) */
function columnasPara(ancho) {
  if (ancho < 600) return 2;
  if (ancho < 900) return 3;
  if (ancho < 1200) return 4;
  if (ancho < 1600) return 5;
  return 6;
}

/** Espacio entre piezas: más compacto en pantallas chicas */
const separacionPara = (ancho) => (ancho < 600 ? 8 : ancho < 1200 ? 14 : 18);

/**
 * Cuántas columnas y filas ocupa cada tamaño.
 * Con una sola columna todas las piezas pasan a ser simples.
 */
function tramos(tam, columnas) {
  if (columnas === 1) return { col: 1, fila: 1 };
  switch (tam) {
    case 'grande': return { col: 2, fila: 2 };
    case 'ancho':  return { col: 2, fila: 1 };
    case 'alto':   return { col: 1, fila: 2 };
    default:       return { col: 1, fila: 1 };
  }
}

export default function Galeria({ imagenes, ajuste, onAbrir }) {
  const ref = useRef(null);
  const [ancho, setAncho] = useState(0);

  // Mide el contenedor y vuelve a medir cada vez que cambia de tamaño
  // (rotar el celular, redimensionar la ventana, etc.)
  useLayoutEffect(() => {
    const el = ref.current;
    const obs = new ResizeObserver(([entrada]) => setAncho(entrada.contentRect.width));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // "ajuste" resta columnas → imágenes más grandes (entre 1 y 8 columnas)
  const columnas = Math.min(8, Math.max(1, columnasPara(ancho) - ajuste));
  const gap = separacionPara(ancho);
  const alturaFila = ancho ? (ancho - gap * (columnas - 1)) / columnas : 0;

  return (
    <div
      ref={ref}
      className="galeria"
      style={{
        gridTemplateColumns: `repeat(${columnas}, 1fr)`,
        gridAutoRows: `${alturaFila}px`,
        gap: `${gap}px`,
      }}
    >
      {/* Hasta que no se mide el ancho no se dibujan las piezas (evita un salto visual) */}
      {ancho > 0 &&
        imagenes.map((img, i) => {
          const { col, fila } = tramos(img.tam, columnas);
          return (
            <Mosaico
              key={img.id}
              imagen={img}
              indice={i}
              total={imagenes.length}
              col={col}
              fila={fila}
              prioritaria={i < 6}
              onAbrir={onAbrir}
            />
          );
        })}
    </div>
  );
}
