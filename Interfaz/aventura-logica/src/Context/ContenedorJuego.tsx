import React, { useEffect, useRef, useState } from "react";
import "../estilos/juego.css";
import MenuLugares from "./MenuLugares";
import InventarioPanel from "./InventarioPanel";
import AccionesPanel from "./AccionesPanel";
import GanePanel from "./GanePanel";
import Consola from "./Consola";
import { ubicacion } from "../api/prologApi";

export default function ContenedorJuego() {
  const [mensajes, setMensajes] = useState<string[]>([]);
  const [lugarActual, setLugarActual] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const invRefrescar = useRef<() => void>();

  const log = (m: string) => setMensajes((prev) => [...prev, `> ${m}`]);
  const onError = (m: string) => setMensajes((prev) => [...prev, `⚠️ ${m}`]);

  useEffect(() => {
    // Consultar ubicación inicial
    ubicacion().then((data) => {
      if (data.status === "ok") {
        setLugarActual(data.jugador);
        setDescripcion(data.descripcion);
      } else {
        onError("No se pudo obtener la ubicación del jugador.");
      }
    });
  }, []);

  return (
    <div className="juego-fondo">
      <div className="panel-superior">
        <h2>🌍 Mundo Misterioso</h2>
        <p>
          <strong>Ubicación actual:</strong> {lugarActual || "Cargando..."}
        </p>
        <p>{descripcion}</p>
      </div>

      <div className="panel-principal">
        <MenuLugares
          onError={onError}
          onMoverExitoso={(lugar) => {
            log(`Te moviste a ${lugar}.`);
      
            ubicacion().then((data) => {
              if (data.status === "ok") {
                setLugarActual(data.jugador);
                setDescripcion(data.descripcion);
              }
            });
          }}
        />

        <div className="paneles-secundarios">
          <AccionesPanel
            onError={onError}
            onExito={log}
            onRefrescarInventario={() => invRefrescar.current?.()}
          />
          <InventarioPanel
            onError={onError}
            ref={(api: any) => {
              if (api) invRefrescar.current = api.refrescar;
            }}
          />
          <GanePanel onError={onError} onExito={log} />
        </div>

        <Consola mensajes={mensajes} />
      </div>
    </div>
  );
}
