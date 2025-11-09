import React, { useState } from "react";
import { verificarGane } from "../api/prologApi";

export default function GanePanel({ onError, onExito }:{
  onError:(m:string)=>void; onExito:(m:string)=>void;
}) {
  const [estado, setEstado] = useState<"aun_no"|"ganaste"|null>(null);

  const check = async () => {
    try {
      const r = await verificarGane();
      setEstado(r.status);
      if (r.status === "ganaste") onExito("🎉 ¡Has ganado!");
      else onExito("Aún no cumples la condición de gane.");
    } catch (e:any) {
      onError("Error al verificar gane: " + e.message);
    }
  };

  return (
    <div className="panel-gane">
      <h3>🏆 Estado de gane</h3>
      <button onClick={check}>Verificar</button>
      {estado && <p>Estado: <strong>{estado}</strong></p>}
    </div>
  );
}
