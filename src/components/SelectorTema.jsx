/**
 * SelectorTema.jsx — botón flotante para personalizar la galería.
 * ------------------------------------------------------------------
 * Está abajo a la derecha: en el celular queda al alcance del pulgar.
 * Al tocarlo se abre un panel con:
 *   - las muestras de cada tema de color (grupo de opciones tipo radio)
 *   - dos botones para agrandar o achicar las imágenes del mosaico
 * Se cierra con Esc, tocando afuera o volviendo a tocar el botón.
 * ------------------------------------------------------------------
 */
import { useEffect, useRef, useState } from 'react';
import { TEMAS, temaPorId } from '../temas.js';
import { IconoMasChico, IconoMasGrande, IconoPaleta } from './Iconos.jsx';

const DENSIDAD_MIN = -1; // más imágenes por fila
const DENSIDAD_MAX = 2;  // imágenes más grandes

export default function SelectorTema({ temaId, onTema, densidad, onDensidad }) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef(null);
  const actual = temaPorId(temaId);

  // Cerrar con Esc o con un toque fuera del panel
  useEffect(() => {
    if (!abierto) return;
    const alTocarAfuera = (e) => {
      if (!contenedor.current.contains(e.target)) setAbierto(false);
    };
    const alPresionar = (e) => e.key === 'Escape' && setAbierto(false);
    document.addEventListener('pointerdown', alTocarAfuera);
    document.addEventListener('keydown', alPresionar);
    return () => {
      document.removeEventListener('pointerdown', alTocarAfuera);
      document.removeEventListener('keydown', alPresionar);
    };
  }, [abierto]);

  /** Flechas del teclado para moverse entre temas (patrón accesible de radio) */
  function alTeclearTema(e, i) {
    const paso = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!paso) return;
    e.preventDefault();
    const siguiente = TEMAS[(i + paso + TEMAS.length) % TEMAS.length];
    onTema(siguiente.id);
    contenedor.current.querySelector(`[data-tema-id="${siguiente.id}"]`)?.focus();
  }

  return (
    <div ref={contenedor} className={`ajustes ${abierto ? 'is-abierto' : ''}`}>
      {abierto && (
        <div className="ajustes__panel" id="panel-ajustes">
          <div className="ajustes__temas" role="radiogroup" aria-label="Tema de color">
            {TEMAS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={t.id === temaId}
                tabIndex={t.id === temaId ? 0 : -1}
                data-tema-id={t.id}
                className="ajustes__tema"
                onClick={() => onTema(t.id)}
                onKeyDown={(e) => alTeclearTema(e, i)}
                title={t.descripcion}
              >
                {/* Muestra: un círculo con el degradé de fondo y el borde del tema */}
                <span
                  className="ajustes__muestra"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${t.vars['--c1']}, ${t.vars['--c2']} 55%, ${t.vars['--c3']})`,
                    borderColor: t.vars['--borde-b'],
                  }}
                  aria-hidden="true"
                />
                <span className="ajustes__nombre">{t.nombre}</span>
              </button>
            ))}
          </div>

          {/* Descripción del tema elegido: ayuda a decidir cuál conviene */}
          <p className="ajustes__descripcion" aria-live="polite">{actual.descripcion}</p>

          <div className="ajustes__densidad" role="group" aria-label="Tamaño de las imágenes">
            <button
              type="button"
              className="boton"
              onClick={() => onDensidad(Math.max(DENSIDAD_MIN, densidad - 1))}
              disabled={densidad <= DENSIDAD_MIN}
              aria-label="Imágenes más chicas"
            >
              <IconoMasChico />
            </button>
            {/* Indicador de puntos: muestra el nivel de tamaño actual */}
            <span className="ajustes__nivel" aria-hidden="true">
              {Array.from({ length: DENSIDAD_MAX - DENSIDAD_MIN + 1 }, (_, n) => (
                <i key={n} className={n + DENSIDAD_MIN <= densidad ? 'on' : ''} />
              ))}
            </span>
            <button
              type="button"
              className="boton"
              onClick={() => onDensidad(Math.min(DENSIDAD_MAX, densidad + 1))}
              disabled={densidad >= DENSIDAD_MAX}
              aria-label="Imágenes más grandes"
            >
              <IconoMasGrande />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="boton ajustes__abrir"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        aria-controls="panel-ajustes"
        aria-label="Cambiar colores y tamaño"
      >
        <IconoPaleta />
      </button>
    </div>
  );
}
