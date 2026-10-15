/**
 * csv-a-json.mjs
 * ------------------------------------------------------------------
 * Convierte la lista de URLs (urls-*.csv) en un JSON que la galería
 * puede importar directamente: src/data/imagenes.json
 *
 * Uso:  npm run datos
 *
 * Para cada URL genera:
 *  - id:    identificador corto y único (sale del nombre del archivo)
 *  - thumb: versión liviana para el mosaico (ImageKit la redimensiona)
 *  - full:  versión grande para el visor a pantalla completa
 *  - tam:   tamaño del mosaico (normal, ancho, alto, grande)
 *
 * Si agregás o quitás fotos, actualizá el CSV y volvé a correr el script.
 * ------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const raiz = resolve(import.meta.dirname, '..');

// Busca el primer CSV que empiece con "urls-" en la raíz del proyecto
const csv = readdirSync(raiz).find((f) => /^urls-.*\.csv$/i.test(f));
if (!csv) {
  console.error('No se encontró ningún archivo urls-*.csv en la raíz.');
  process.exit(1);
}

// Lee las líneas, descarta el encabezado ("url") y las líneas vacías
const urls = readFileSync(resolve(raiz, csv), 'utf8')
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l.startsWith('http'));

/**
 * ImageKit permite transformar la imagen cambiando el parámetro "tr".
 * Reemplazamos el ancho original por el que necesitemos.
 */
function conAncho(url, ancho) {
  // Se quita el "tr" existente y se agrega uno nuevo (w = ancho, f = formato)
  const base = url.replace(/([?&])tr=[^&]*&?/, '$1').replace(/[?&]$/, '');
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}tr=w-${ancho}:f-webp`;
}

/**
 * Patrón de tamaños que se repite. Está pensado para que el mosaico
 * se vea variado pero equilibrado (mayoría de piezas normales,
 * con algunos acentos grandes, anchos y altos).
 */
const patron = [
  'grande', 'normal', 'alto', 'normal', 'ancho', 'normal', 'normal',
  'alto', 'normal', 'ancho', 'normal', 'grande', 'normal', 'alto',
  'normal', 'normal', 'ancho', 'normal',
];

const imagenes = urls.map((url, i) => {
  const archivo = new URL(url).pathname.split('/').pop(); // IMG_2026..._719.jpg
  const tam = patron[i % patron.length];
  return {
    id: archivo.replace(/\.[a-z]+$/i, ''),
    thumb: conAncho(url, tam === 'grande' ? 1000 : 640),
    full: conAncho(url, 1600),
    tam,
  };
});

const destino = resolve(raiz, 'src/data/imagenes.json');
writeFileSync(destino, JSON.stringify(imagenes, null, 2) + '\n');
console.log(`✔ ${imagenes.length} imágenes escritas en src/data/imagenes.json`);
