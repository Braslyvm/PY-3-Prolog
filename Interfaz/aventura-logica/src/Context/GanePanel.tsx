import React from "react";
import { verificaGane, comoGano, lugaresVisitados } from "../api/prologApi";

interface Props {
  onError: (m: string) => void;
  onExito: (m: string) => void;
}

export default function GanePanel({ onError, onExito }: Props) {

 
  const check = async () => {
    try {
      const res = await verificaGane();

      if (Array.isArray(res)) {
      
        if (res.length === 1 && res[0] === 0) {
          onExito("Aún no cumples la condición de gane.");
          return;
        }

        
        const estadoItem = res.find((x: any) => x[0] === "Estado");
        const camino = res.find((x: any) => x[0] === "Camino");
        const inventario = res.find((x: any) => x[0] === "Inventario");
        const condicion = res.find((x: any) => x[0] === "CondicionGane");

        if (estadoItem && estadoItem[1] === 1) {
          onExito("🏆 ¡Has ganado la partida!");
          if (camino) onExito(`📍 Camino recorrido: ${camino[1].join(" → ")}`);
          if (inventario) onExito(`🎒 Inventario: ${inventario[1].join(", ")}`);
          if (condicion)
            onExito(`💎 Condición de gane: ${condicion[1].join(" en ")}.`);
        } else {
          onExito("Aún no cumples la condición de gane.");
        }
      } else {
        onError("Formato inesperado de respuesta del servidor.");
      }
    } catch (e: any) {
      onError("Error al verificar gane: " + e.message);
    }
  };

  
const verComoGano = async () => {
  try {
    const res = await comoGano();

    if (Array.isArray(res)) {
      if (res.length === 0) {
        onExito(" No hay caminos registrados para ganar.");
        return;
      }

      onExito("📜 POSIBLES CAMINOS PARA GANAR:");

      res.forEach((ruta: any, index: number) => {
        if (!Array.isArray(ruta)) return;

        onExito(`\n Camino posible #${index + 1}:`);

        let inicio = "";
        let destino = "";
        let camino: string[] = [];
        let requisitos: any[] = [];
        let tesoro = "";

        ruta.forEach((item: any) => {
          if (!Array.isArray(item) || item.length < 2) return;
          const [clave, valor] = item;

          switch (clave) {
            case "inicio":
              inicio = valor;
              break;
            case "destino":
              destino = valor;
              break;
            case "camino":
              camino = Array.isArray(valor) ? valor : [];
              break;
            case "requisitos":
              requisitos = Array.isArray(valor) ? valor : [];
              break;
            case "tesoro":
              tesoro = valor;
              break;
          }
        });

        if (inicio) onExito(`   • Inicio: ${inicio}`);
        if (destino) onExito(`   • Destino: ${destino}`);
        if (camino.length > 0)
          onExito(`   • Camino: ${camino.join(" → ")}`);
        if (requisitos.length > 0) {
          onExito("   • Requisitos:");
          requisitos.forEach((req: any) => {
            if (Array.isArray(req) && req.length === 3) {
              const [lugar, tipo, obj] = req;
              onExito(`       - ${lugar} ${tipo} ${obj}`);
            }
          });
        }
        if (tesoro) onExito(`   • Tesoro: ${tesoro}`);
      });
    } else {
      onError("Formato inesperado del servidor en /api/como_gano.");
    }
  } catch (e: any) {
    onError("Error al consultar cómo ganar: " + e.message);
  }
};

  const verVisitados = async () => {
    try {
      const res = await lugaresVisitados();
      if (res.status === "ok" && Array.isArray(res.lugares)) {
        onExito(` Lugares visitados: ${res.lugares.join(" → ")}`);
      } else {
        onError("No se pudo obtener la lista de lugares visitados.");
      }
    } catch (e: any) {
      onError("Error al consultar lugares visitados: " + e.message);
    }
  };

  return (
    <div className="panel-gane">
      <h3>🕹️ Panel de control</h3>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button onClick={check}>Verificar</button>
        <button onClick={verComoGano}>¿Cómo gano?</button>
        <button onClick={verVisitados}>Lugares visitados</button>
      </div>
    </div>
  );
}
