#!/usr/bin/env node
// Convierte un CSV de URLs de ImageKit en un imagenes.json para la galería.
//
// Uso:
//   node csv-a-json.mjs <archivo.csv> [salida.json] [--ordenar]
//
// Ejemplos:
//   node csv-a-json.mjs urls.csv
//   node csv-a-json.mjs urls.csv src/data/imagenes.json --ordenar
//
// El CSV debe tener una columna "url" (o simplemente una URL por línea).

import fs from "node:fs";
import path from "node:path";

// ---- Configuración (cambiá estos valores si querés otros tamaños) ----
const ANCHO_THUMB = 640;
const ANCHO_FULL = 1600;
const FORMATO = "webp";
const TAM_POR_DEFECTO = "normal";
// ----------------------------------------------------------------------

const args = process.argv.slice(2);
const ordenar = args.includes("--ordenar");
const [entrada, salida = "imagenes.json"] = args.filter((a) => !a.startsWith("--"));

if (!entrada) {
  console.error("Uso: node csv-a-json.mjs <archivo.csv> [salida.json] [--ordenar]");
  process.exit(1);
}
if (!fs.existsSync(entrada)) {
  console.error(`No encuentro el archivo: ${entrada}`);
  process.exit(1);
}

// Leer el CSV y quedarnos solo con las líneas que tienen una URL
const texto = fs.readFileSync(entrada, "utf8").replace(/^﻿/, ""); // quita BOM de Excel
const urls = texto
  .split(/\r?\n/)
  .map((linea) => linea.trim().replace(/^"|"$/g, "")) // quita comillas si las hay
  .filter((linea) => /^https?:\/\//i.test(linea));

const vistas = new Set();
let imagenes = [];

for (const url of urls) {
  // URL sin parámetros (?tr=...)
  const base = url.split("?")[0];
  if (vistas.has(base)) continue; // evita duplicados
  vistas.add(base);

  const archivo = decodeURIComponent(base.split("/").pop());
  const id = path.parse(archivo).name;

  imagenes.push({
    id,
    thumb: `${base}?tr=w-${ANCHO_THUMB}:f-${FORMATO}`,
    full: `${base}?tr=w-${ANCHO_FULL}:f-${FORMATO}`,
    tam: TAM_POR_DEFECTO,
  });
}

if (ordenar) {
  // Ordena por nombre de archivo, con números en orden natural (WA0009 antes que WA0010)
  imagenes.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

fs.mkdirSync(path.dirname(path.resolve(salida)), { recursive: true });
fs.writeFileSync(salida, JSON.stringify(imagenes, null, 2) + "\n", "utf8");

const duplicadas = urls.length - imagenes.length;
console.log(`✔ ${imagenes.length} imágenes guardadas en ${salida}`);
if (duplicadas > 0) console.log(`  (se omitieron ${duplicadas} URLs duplicadas)`);
