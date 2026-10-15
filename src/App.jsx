/**
 * App.jsx — componente raíz.
 * ------------------------------------------------------------------
 * Coordina las tres piezas de la página:
 *   <Galeria>       el mosaico de imágenes
 *   <Visor>         la imagen a pantalla completa (cuando hay una abierta)
 *   <SelectorTema>  el botón flotante para cambiar colores y tamaño
 *
 * También guarda en el navegador (localStorage) el tema y el tamaño
 * elegidos, para que se mantengan la próxima vez que se visite el sitio.
 * ------------------------------------------------------------------
 */
import { useEffect, useState } from 'react';
import imagenes from './data/imagenes.json';
import { temaPorId } from './temas.js';
import Galeria from './components/Galeria.jsx';
import Visor from './components/Visor.jsx';
import SelectorTema from './components/SelectorTema.jsx';

/** Lee una preferencia guardada; si falla (modo privado, etc.) usa el valor por defecto */
function leer(clave, porDefecto) {
  try {
    return localStorage.getItem(clave) ?? porDefecto;
  } catch {
    return porDefecto;
  }
}

/** Guarda una preferencia sin romper la página si el navegador lo impide */
function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, valor);
  } catch {
    /* sin almacenamiento disponible: no pasa nada */
  }
}

/**
 * Tema inicial: el guardado o, si es la primera visita, uno que
 * respete la configuración del sistema operativo del visitante.
 */
function temaInicial() {
  const guardado = leer('galeria:tema', null);
  if (guardado) return guardado;
  if (window.matchMedia?.('(prefers-contrast: more)').matches) return 'contraste';
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'oscuro';
  return 'claro';
}

export default function App() {
  const [temaId, setTemaId] = useState(temaInicial);
  // densidad: -1 = imágenes más chicas (más por fila), 0 = normal, 1/2 = más grandes
  const [densidad, setDensidad] = useState(() => Number(leer('galeria:densidad', 0)) || 0);
  // índice de la imagen abierta en el visor (null = visor cerrado)
  const [abierta, setAbierta] = useState(null);

  const tema = temaPorId(temaId);

  // Cada vez que cambia el tema, se copian sus variables CSS a <html>
  useEffect(() => {
    const raiz = document.documentElement;
    Object.entries(tema.vars).forEach(([k, v]) => raiz.style.setProperty(k, v));
    raiz.style.setProperty('--filtro-imagen', tema.filtroImagen ?? 'none');
    raiz.dataset.tema = tema.id;
    raiz.dataset.calmo = tema.calmo ? 'si' : 'no';
    // Barra del navegador en móviles del mismo color que el fondo
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tema.vars['--base']);
    guardar('galeria:tema', tema.id);
  }, [tema]);

  useEffect(() => guardar('galeria:densidad', String(densidad)), [densidad]);

  return (
    <>
      <main>
        <Galeria
          imagenes={imagenes}
          ajuste={densidad + (tema.ajuste ?? 0)}
          onAbrir={setAbierta}
        />
      </main>

      {abierta !== null && (
        <Visor
          imagenes={imagenes}
          indice={abierta}
          onCambiar={setAbierta}
          onCerrar={() => setAbierta(null)}
        />
      )}

      <SelectorTema
        temaId={tema.id}
        onTema={setTemaId}
        densidad={densidad}
        onDensidad={setDensidad}
      />
    </>
  );
}
