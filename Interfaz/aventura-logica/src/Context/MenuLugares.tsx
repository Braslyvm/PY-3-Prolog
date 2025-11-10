import React, { useEffect, useState } from "react";
import { obtenerLugares, mover, puedoIr } from "../api/prologApi";

interface Lugar {
  nombre: string;
  descripcion: string;
}

interface MenuLugaresProps {
  onError: (mensaje: string) => void;
  onMoverExitoso?: (lugar: string) => void;
}

export default function MenuLugares({ onError, onMoverExitoso }: MenuLugaresProps) {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [mostrarLista, setMostrarLista] = useState(false);

  useEffect(() => {
    obtenerLugares()
      .then((data) => setLugares(data.lugares || []))
      .catch((err) => onError("Error cargando lugares: " + err.message));
  }, [onError]);

  const moverA = async (nombre: string) => {
    try {
      const res = await mover(nombre);
      if (res.status === "ok") {
        onMoverExitoso?.(nombre);
      } else {
        onError(res.message || "No puedes moverte ahí");
      }
    } catch (e: any) {
      onError("Error al mover: " + e.message);
    }
  };

  const verificarIr = async (nombre: string) => {
    try {
      const res = await puedoIr(nombre);
      if (res.status === "ok") {
        onError(`✅ Puedes moverte a ${nombre}.`);
      } else {
        onError(` ${res.message || "No puedes ir ahí todavía."}`);
      }
    } catch (e: any) {
      onError("Error al verificar: " + e.message);
    }
  };

  const lugarActual = lugares[indiceActual];

  const siguiente = () => {
    if (lugares.length > 0)
      setIndiceActual((prev) => (prev + 1) % lugares.length);
  };

  const anterior = () => {
    if (lugares.length > 0)
      setIndiceActual((prev) => (prev - 1 + lugares.length) % lugares.length);
  };

  return (
    <div className="menu-lugares">
      <h3>MOVERSE A:</h3>

      {lugares.length > 0 && (
        <div className="carrusel">
          <button onClick={anterior}>◀</button>
          <strong>[{lugarActual?.nombre}]</strong>
          <button onClick={siguiente}>▶</button>
          <button className="btn-ir" onClick={() => moverA(lugarActual.nombre)}>
            Ir
          </button>
          <button
            className="btn-ir"
            style={{ marginLeft: "0.4rem" }}
            onClick={() => verificarIr(lugarActual.nombre)}
          >
            ¿Puedo ir?
          </button>
        </div>
      )}

      <button
        className="ver-todos"
        onClick={() => setMostrarLista(!mostrarLista)}
      >
        {mostrarLista ? "Ocultar ▲" : "Ver todos ▼"}
      </button>

      {mostrarLista && (
        <div className="lista-scroll">
          <ul>
            {lugares.map((lugar, index) => (
              <li key={`${lugar.nombre}-${index}`}>
                <strong>{lugar.nombre}</strong> — {lugar.descripcion}{" "}
                <button className="btn-ir" onClick={() => moverA(lugar.nombre)}>
                  Ir
                </button>
                <button
                  className="btn-ir"
                  style={{ marginLeft: "0.4rem" }}
                  onClick={() => verificarIr(lugar.nombre)}
                >
                  ¿Puedo ir?
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
