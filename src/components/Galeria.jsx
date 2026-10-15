/**
 * Galeria.jsx — el mosaico irregular de imágenes.
 * ------------------------------------------------------------------
 * Cada pieza tiene una forma propia (ancho y alto distintos, ver
 * scripts/csv-a-json.mjs), así el mosaico no queda simétrico.
 *
 * Para que piezas tan distintas encajen SIN dejar huecos, usamos una
 * grilla fina:
 *   - cada columna "visual" se divide en 2 medias columnas
 *   - cada fila mide un cuarto del ancho de una columna
 * y en lugar de dejar que el navegador las acomode, las ubicamos
 * nosotros con un algoritmo de "horizonte" (como apilar cajas):
 * cada foto va al punto más bajo libre, y si no entra se angosta.
 *
 * La cantidad de columnas se calcula según el ANCHO REAL del contenedor
 * (no de la ventana), medido con un ResizeObserver:
 *   - celular       → 2 columnas
 *   - tablet        → 3 a 4 columnas
 *   - escritorio    → 5 a 6 columnas
 * ------------------------------------------------------------------
 */
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
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
 * Ubica cada imagen en la grilla fina (medidas en medias columnas y filas).
 * Devuelve { piezas: [{x, y, w, h}], filas } en el mismo orden que las imágenes,
 * así el orden de lectura (teclado, lector de pantalla, visor) se mantiene.
 */
function acomodar(imagenes, medias) {
  const alturas = new Array(medias).fill(0); // hasta qué fila está ocupada cada media columna
  const ultima = new Array(medias).fill(-1); // qué pieza quedó arriba de cada media columna
  const piezas = [];

  imagenes.forEach((img, i) => {
    // 1. El punto libre más bajo (y más a la izquierda)…
    const y = Math.min(...alturas);
    const x = alturas.indexOf(y);
    // …y cuánto lugar plano hay ahí
    let libre = 0;
    while (x + libre < medias && alturas[x + libre] === y) libre++;

    // 2. Si la foto no entra, se angosta. Nunca deja un hueco de media
    //    columna suelta (ninguna pieza podría llenarlo).
    let w = Math.min(img.ancho, libre);
    if (libre - w === 1) w = w > 2 ? w - 1 : libre;

    // 3. El alto se ajusta para conservar la proporción elegida
    const h = Math.max(3, Math.round((img.alto * w) / img.ancho));

    piezas.push({ x, y, w, h });
    for (let c = x; c < x + w; c++) {
      alturas[c] = y + h;
      ultima[c] = i;
    }
  });

  // 4. Emparejar el borde de abajo: las piezas que quedaron arriba de todo
  //    se estiran hasta la última fila (si no se deforman demasiado).
  const filas = Math.max(...alturas);
  piezas.forEach((p, i) => {
    const arriba = ultima.slice(p.x, p.x + p.w).every((u) => u === i);
    const nuevoAlto = filas - p.y;
    if (arriba && nuevoAlto <= p.h * 1.8) p.h = nuevoAlto;
  });

  return { piezas, filas };
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
  const medias = columnas * 2;
  const gap = separacionPara(ancho);
  const anchoMedia = ancho ? (ancho - gap * (medias - 1)) / medias : 0;
  // Elegido para que una pieza de 2 medias × 4 filas sea un cuadrado exacto
  const alturaFila = Math.max(1, (anchoMedia - gap) / 2);

  // El acomodo sólo se recalcula si cambian las imágenes o las columnas
  const { piezas } = useMemo(() => acomodar(imagenes, medias), [imagenes, medias]);

  return (
    <div
      ref={ref}
      className="galeria"
      style={{
        gridTemplateColumns: `repeat(${medias}, 1fr)`,
        gridAutoRows: `${alturaFila}px`,
        gap: `${gap}px`,
      }}
    >
      {/* Hasta que no se mide el ancho no se dibujan las piezas (evita un salto visual) */}
      {ancho > 0 &&
        imagenes.map((img, i) => (
          <Mosaico
            key={img.id}
            imagen={img}
            indice={i}
            total={imagenes.length}
            lugar={piezas[i]}
            prioritaria={i < 6}
            onAbrir={onAbrir}
          />
        ))}
    </div>
  );
}
