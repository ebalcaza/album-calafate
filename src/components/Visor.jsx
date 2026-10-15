/**
 * Visor.jsx — muestra una imagen a pantalla completa.
 * ------------------------------------------------------------------
 * Formas de usarlo:
 *   Celular:     deslizar ← → para cambiar de foto, deslizar ↓ para cerrar,
 *                doble toque para acercar (zoom) y arrastrar para recorrerla.
 *   Escritorio:  flechas ← → del teclado, Esc para cerrar,
 *                doble clic para acercar, clic en el fondo para cerrar.
 *
 * Mientras descarga la versión grande, se muestra la miniatura (que ya
 * está en caché) para que nunca aparezca una pantalla vacía.
 * ------------------------------------------------------------------
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IconoAnterior, IconoCerrar, IconoLupaMas, IconoLupaMenos, IconoSiguiente } from './Iconos.jsx';

const UMBRAL_DESLIZAR = 60;   // px horizontales para pasar de foto
const UMBRAL_CERRAR = 100;    // px hacia abajo para cerrar
const DOBLE_TOQUE_MS = 300;   // tiempo máximo entre dos toques
const FACTOR_ZOOM = 2.2;      // cuánto se agranda con el zoom

export default function Visor({ imagenes, indice, onCambiar, onCerrar }) {
  const total = imagenes.length;
  const imagen = imagenes[indice];

  // El zoom y la carga se guardan junto al id de la foto: al cambiar de
  // foto quedan "vencidos" solos, sin parpadeos ni efectos extra.
  const [estadoZoom, setZoom] = useState(null);     // { id, ancho, alto, rx, ry }
  const [idCargada, setIdCargada] = useState(null); // id de la foto grande ya descargada
  const [desplaz, setDesplaz] = useState({ x: 0, y: 0 }); // arrastre en curso
  const zoom = estadoZoom?.id === imagen.id ? estadoZoom : null;
  const cargada = idCargada === imagen.id;

  const dialogo = useRef(null);
  const escenario = useRef(null);
  const foto = useRef(null);
  const inicio = useRef(null);       // dónde empezó el arrastre
  const ultimoToque = useRef(0);     // para detectar doble toque
  const indiceActual = useRef(indice);
  indiceActual.current = indice;

  // Navegación circular: después de la última vuelve a la primera
  const anterior = useCallback(() => onCambiar((indice - 1 + total) % total), [indice, total, onCambiar]);
  const siguiente = useCallback(() => onCambiar((indice + 1) % total), [indice, total, onCambiar]);

  // Precarga la foto anterior y la siguiente → el cambio es instantáneo
  useEffect(() => {
    [indice - 1, indice + 1].forEach((i) => {
      new Image().src = imagenes[(i + total) % total].full;
    });
  }, [indice, imagenes, total]);

  // Al abrir: bloquea el scroll de la página y pone el foco en el visor.
  // Al cerrar: lo devuelve a la pieza del mosaico que se estaba viendo.
  useEffect(() => {
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogo.current?.querySelector('.visor__cerrar')?.focus();
    return () => {
      document.body.style.overflow = overflowPrevio;
      document.querySelector(`[data-indice="${indiceActual.current}"]`)?.focus();
    };
  }, []);

  // Teclado: Esc, flechas, y Tab encerrado dentro del visor (accesibilidad)
  useEffect(() => {
    function alPresionar(e) {
      if (e.key === 'Escape') onCerrar();
      else if (e.key === 'ArrowLeft' && !zoom) anterior();
      else if (e.key === 'ArrowRight' && !zoom) siguiente();
      else if (e.key === 'Tab') {
        const botones = [...dialogo.current.querySelectorAll('button')];
        const primero = botones[0];
        const ultimo = botones[botones.length - 1];
        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primero.focus();
        }
      }
    }
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [anterior, siguiente, onCerrar, zoom]);

  /**
   * Activa / desactiva el zoom. (x, y) es el punto tocado: se usa para
   * que la parte ampliada sea justamente la que el usuario señaló.
   */
  const alternarZoom = useCallback((x, y) => {
    if (zoom) return setZoom(null);
    const r = foto.current.getBoundingClientRect();
    const rx = x == null ? 0.5 : (x - r.left) / r.width;
    const ry = y == null ? 0.5 : (y - r.top) / r.height;
    setZoom({ id: imagen.id, ancho: r.width * FACTOR_ZOOM, alto: r.height * FACTOR_ZOOM, rx, ry });
  }, [zoom, imagen.id]);

  // Después de ampliar, desplaza el escenario hasta el punto tocado
  useLayoutEffect(() => {
    if (!zoom) return;
    const esc = escenario.current;
    esc.scrollLeft = zoom.rx * esc.scrollWidth - esc.clientWidth / 2;
    esc.scrollTop = zoom.ry * esc.scrollHeight - esc.clientHeight / 2;
  }, [zoom]);

  /* ---------- Gestos con dedo o mouse (Pointer Events) ---------- */

  function alBajar(e) {
    if (e.button > 0) return; // sólo botón principal del mouse
    const esc = escenario.current;
    inicio.current = {
      x: e.clientX,
      y: e.clientY,
      enFoto: e.target === foto.current, // se guarda ahora: con "capture" el target cambia
      scrollX: esc.scrollLeft,
      scrollY: esc.scrollTop,
    };
    // Con zoom y dedo, el navegador hace el desplazamiento nativo: no capturamos
    if (!zoom || e.pointerType === 'mouse') e.currentTarget.setPointerCapture(e.pointerId);
  }

  function alMover(e) {
    const ini = inicio.current;
    if (!ini) return;
    const dx = e.clientX - ini.x;
    const dy = e.clientY - ini.y;
    if (zoom) {
      // Con zoom y mouse: arrastrar recorre la foto ampliada
      if (e.pointerType === 'mouse') {
        escenario.current.scrollLeft = ini.scrollX - dx;
        escenario.current.scrollTop = ini.scrollY - dy;
      }
      return;
    }
    // La foto sigue al dedo: horizontal para navegar, hacia abajo para cerrar
    setDesplaz(Math.abs(dx) > Math.abs(dy) ? { x: dx, y: 0 } : { x: 0, y: Math.max(0, dy) });
  }

  function alSoltar(e) {
    const ini = inicio.current;
    inicio.current = null;
    setDesplaz({ x: 0, y: 0 });
    if (!ini) return;

    const dx = e.clientX - ini.x;
    const dy = e.clientY - ini.y;

    if (!zoom) {
      if (Math.abs(dx) > UMBRAL_DESLIZAR && Math.abs(dx) > Math.abs(dy)) {
        return dx < 0 ? siguiente() : anterior();
      }
      if (dy > UMBRAL_CERRAR && dy > Math.abs(dx)) return onCerrar();
    }

    // Si casi no se movió, fue un toque / clic
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      if (!ini.enFoto) {
        if (!zoom) onCerrar(); // toque en el fondo → cerrar
        return;
      }
      const ahora = Date.now();
      if (ahora - ultimoToque.current < DOBLE_TOQUE_MS) {
        ultimoToque.current = 0;
        alternarZoom(e.clientX, e.clientY);
      } else {
        ultimoToque.current = ahora;
      }
    }
  }

  function alCancelar() {
    inicio.current = null;
    setDesplaz({ x: 0, y: 0 });
  }

  // Al deslizar hacia abajo la foto se achica y el fondo se aclara
  const progresoCierre = Math.min(desplaz.y / 300, 1);
  const arrastrando = desplaz.x !== 0 || desplaz.y !== 0;

  return (
    <div
      ref={dialogo}
      className="visor"
      role="dialog"
      aria-modal="true"
      aria-label={`Fotografía ${indice + 1} de ${total}`}
      style={{ '--cierre': progresoCierre }}
    >
      {/* Aura: la misma foto muy desenfocada detrás, como luz ambiente */}
      <div className="visor__aura" style={{ backgroundImage: `url("${imagen.thumb}")` }} aria-hidden="true" />

      <div
        ref={escenario}
        className={`visor__escenario ${zoom ? 'is-zoom' : ''}`}
        onPointerDown={alBajar}
        onPointerMove={alMover}
        onPointerUp={alSoltar}
        onPointerCancel={alCancelar}
      >
        <img
          ref={foto}
          key={imagen.id}
          className={`visor__img ${arrastrando ? 'is-arrastrando' : ''}`}
          // Primero la miniatura (instantánea); al terminar de bajar, la grande
          src={cargada ? imagen.full : imagen.thumb}
          alt={`Fotografía de naturaleza ${indice + 1} de ${total}`}
          draggable="false"
          style={{
            ...(zoom && { width: zoom.ancho, height: zoom.alto }),
            transform: arrastrando
              ? `translate(${desplaz.x}px, ${desplaz.y}px) scale(${1 - progresoCierre * 0.25})`
              : undefined,
          }}
        />
        {/* Imagen invisible que descarga la versión grande en segundo plano */}
        {!cargada && (
          <img
            key={`pre-${imagen.id}`}
            className="visor__precarga"
            src={imagen.full}
            alt=""
            aria-hidden="true"
            onLoad={() => setIdCargada(imagen.id)}
          />
        )}
      </div>

      {!cargada && <div className="visor__cargando" aria-hidden="true" />}

      <span className="visor__contador" aria-live="polite">
        {indice + 1} / {total}
      </span>

      <div className="visor__acciones">
        <button
          type="button"
          className="boton visor__zoom"
          onClick={() => alternarZoom()}
          aria-label={zoom ? 'Alejar' : 'Acercar'}
          aria-pressed={!!zoom}
        >
          {zoom ? <IconoLupaMenos /> : <IconoLupaMas />}
        </button>
        <button type="button" className="boton visor__cerrar" onClick={onCerrar} aria-label="Cerrar">
          <IconoCerrar />
        </button>
      </div>

      <button type="button" className="boton visor__nav visor__nav--ant" onClick={anterior} aria-label="Foto anterior">
        <IconoAnterior />
      </button>
      <button type="button" className="boton visor__nav visor__nav--sig" onClick={siguiente} aria-label="Foto siguiente">
        <IconoSiguiente />
      </button>
    </div>
  );
}
