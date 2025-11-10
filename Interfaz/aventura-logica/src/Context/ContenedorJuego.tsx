import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 importamos el hook
import "../estilos/juego.css";
import MenuLugares from "./MenuLugares";
import InventarioPanel from "./InventarioPanel";
import AccionesPanel from "./AccionesPanel";
import GanePanel from "./GanePanel";
import Consola from "./Consola";
import { ubicacion, reiniciarTotal } from "../api/prologApi";

export default function ContenedorJuego() {
  const navigate = useNavigate(); // 👈 inicializa navegación
  const [mensajes, setMensajes] = useState<string[]>([]);
  const [lugarActual, setLugarActual] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const invRefrescar = useRef<() => void>();

  const log = (m: string) => setMensajes((prev) => [...prev, `> ${m}`]);
  const onError = (m: string) => setMensajes((prev) => [...prev, `⚠️ ${m}`]);

  useEffect(() => {
    ubicacion().then((data) => {
      if (data.status === "ok") {
        setLugarActual(data.jugador);
        setDescripcion(data.descripcion);
      } else {
        onError("No se pudo obtener la ubicación del jugador.");
      }
    });
  }, []);

 
  const reiniciarJuego = async () => {
    if (!window.confirm("¿Deseas reiniciar completamente el mundo?")) return;
    try {
      const res = await reiniciarTotal();
      if (res.status === "ok") {
        log(" Sistema reiniciado completamente. Mundo restaurado.");
        window.location.reload();
      } else onError("Error al reiniciar el sistema.");
    } catch (e: any) {
      onError("Error al reiniciar: " + e.message);
    }
  };

  
  const salir = () => {
    if (window.confirm("¿Deseas salir del juego?")) {
      log("👋 Has salido del Mundo Misterioso.");
      navigate("/");
    }
  };

  return (
    <div className="juego-fondo">
      <div className="panel-superior">
        <h2>🌍 Aventura del Tesoro Perdido</h2>
        <p>
          <strong>Ubicación actual:</strong> {lugarActual || "Cargando..."}
        </p>
        <p>{descripcion}</p>

        {/* Botones de control */}
        <div
          style={{
            marginTop: "0.5rem",
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
          }}
        >
          <button className="btn-ir" onClick={reiniciarJuego}>
            🔄 Reiniciar juego
          </button>
          <button className="btn-ir" onClick={salir}>
            🚪 Salir
          </button>
        </div>
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
