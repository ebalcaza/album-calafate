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
 *  - ancho / alto: forma irregular de la pieza en el mosaico
 *
 * Si agregás o quitás fotos, actualizá el CSV y volvé a correr el script.
 * ------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const raiz = resolve(import.meta.dirname, '..');

// Busca el primer CSV que empiece con "urls-" en la raíz del proyecto
const csv = readdirSync(raiz).find((f) => /^urls\.csv$/i.test(f));
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
 * Número "al azar" pero siempre igual para el mismo texto (hash FNV-1a).
 * Así cada foto conserva su forma aunque se regenere el JSON o se
 * agreguen fotos nuevas. Devuelve un valor entre 0 y 1.
 */
function azarFijo(texto) {
  let h = 2166136261;
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0) / 4294967296;
}

/**
 * Forma irregular de cada pieza, medida en la grilla fina de Galeria.jsx:
 *  - ancho: en MEDIAS columnas (2 = una columna, 3 = una y media, 4 = dos)
 *  - alto:  en CUARTOS de columna (4 con ancho 2 = un cuadrado)
 * La proporción alto/ancho varía entre 0.6 (apaisada) y 1.7 (vertical),
 * por eso casi ninguna pieza queda igual a su vecina.
 */
function formaPara(id) {
  const a = azarFijo(id);
  const b = azarFijo(id + '·alto');
  const ancho = a < 0.45 ? 2 : a < 0.8 ? 3 : 4;
  const proporcion = 0.6 + b * 1.1;
  const alto = Math.max(3, Math.round(ancho * 2 * proporcion));
  return { ancho, alto };
}

const imagenes = urls.map((url) => {
  const archivo = new URL(url).pathname.split('/').pop(); // IMG_2026..._719.jpg
  const id = archivo.replace(/\.[a-z]+$/i, '');
  const { ancho, alto } = formaPara(id);
  return {
    id,
    thumb: conAncho(url, ancho === 4 ? 1000 : 640),
    full: conAncho(url, 1600),
    ancho,
    alto,
  };
});

const destino = resolve(raiz, 'src/data/imagenes.json');
writeFileSync(destino, JSON.stringify(imagenes, null, 2) + '\n');
console.log(`✔ ${imagenes.length} imágenes escritas en src/data/imagenes.json`);
