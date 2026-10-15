/**
 * Mosaico.jsx — una pieza del mosaico.
 * ------------------------------------------------------------------
 * Es un <button> (no un <div>) para que se pueda abrir con el teclado
 * (Tab + Enter) y lo anuncien correctamente los lectores de pantalla.
 *
 * Estructura visual:
 *   .mosaico          → marco con degradé + sombra (profundidad)
 *     .mosaico__img   → la foto, que aparece con un fundido al cargar
 * ------------------------------------------------------------------
 */
import { useState } from 'react';

export default function Mosaico({ imagen, indice, total, lugar, prioritaria, onAbrir }) {
  // Mientras la foto descarga se ve un brillo animado de "cargando"
  const [cargada, setCargada] = useState(false);

  return (
    <button
      type="button"
      className={`mosaico ${cargada ? 'is-cargada' : ''}`}
      // Posición exacta calculada en Galeria.jsx (las grillas CSS cuentan desde 1)
      style={{
        gridColumn: `${lugar.x + 1} / span ${lugar.w}`,
        gridRow: `${lugar.y + 1} / span ${lugar.h}`,
      }}
      data-indice={indice}
      onClick={() => onAbrir(indice)}
      aria-label={`Ver fotografía ${indice + 1} de ${total} en pantalla completa`}
    >
      <img
        className="mosaico__img"
        src={imagen.thumb}
        alt=""
        // Las primeras imágenes se cargan enseguida; el resto, al acercarse con el scroll
        loading={prioritaria ? 'eager' : 'lazy'}
        fetchPriority={prioritaria ? 'high' : 'auto'}
        decoding="async"
        draggable="false"
        onLoad={() => setCargada(true)}
        onError={() => setCargada(true)}
      />
    </button>
  );
}
