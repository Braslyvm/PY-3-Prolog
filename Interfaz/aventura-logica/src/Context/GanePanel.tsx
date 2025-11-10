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
        onExito("📜 POSIBLES CAMINOS PARA GANAR:");
        res.forEach((item: any) => {
          if (Array.isArray(item)) {
            const [clave, valor] = item;
            if (clave === "inicio") onExito(`🔹 Inicio: ${valor}`);
            else if (clave === "destino") onExito(`🏁 Destino: ${valor}`);
            else if (clave === "camino")
              onExito(`🧭 Camino: ${valor.join(" → ")}`);
            else if (clave === "📋 requisitos" && Array.isArray(valor)) {
              onExito(" Requisitos:");
              valor.forEach((r: any) =>
                onExito(`   • ${r[0]} ${r[1]} ${r[2]}`)
              );
            } else if (clave === "tesoro") onExito(`💰 Tesoro: ${valor}`);
          }
        });
      } else {
        onError("Formato inesperado de /como_gano");
      }
    } catch (e: any) {
      onError("Error al consultar cómo ganar: " + e.message);
    }
  };

  // ✅ Mostrar los lugares visitados
  const verVisitados = async () => {
    try {
      const res = await lugaresVisitados();
      if (res.status === "ok" && Array.isArray(res.lugares)) {
        onExito(`📍 Lugares visitados: ${res.lugares.join(" → ")}`);
      } else {
        onError("⚠️ No se pudo obtener la lista de lugares visitados.");
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
