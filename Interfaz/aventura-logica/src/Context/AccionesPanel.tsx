import React, { useState } from "react";
import { tomar, usar } from "../api/prologApi";

interface Props {
  onError: (m: string) => void;
  onExito?: (m: string) => void;   // para registrar en consola
  onRefrescarInventario?: () => void;
}

export default function AccionesPanel({ onError, onExito, onRefrescarInventario }: Props) {
  const [obj, setObj] = useState("");

  const doTomar = async () => {
    if (!obj.trim()) return;
    const res = await tomar(obj.trim());
    if (res.status === "ok") {
      onExito?.(`Has tomado ${obj.trim()}.`);
      onRefrescarInventario?.();
      setObj("");
    } else onError(res.message || "No se puede tomar ese objeto");
  };

  const doUsar = async () => {
    if (!obj.trim()) return;
    const res = await usar(obj.trim());
    if (res.status === "ok") {
      onExito?.(`Has usado ${obj.trim()}.`);
       onRefrescarInventario?.(); 
    } else onError(res.message || "No puedes usar ese objeto");
  };

  return (
    <div className="panel-acciones">
      <h3>⚙️ Acciones</h3>
      <div className="fila">
        <input
          value={obj}
          onChange={(e)=>setObj(e.target.value)}
          placeholder="llave, antorcha, etc."
        />
        <button onClick={doTomar}>Tomar</button>
        <button onClick={doUsar}>Usar</button>
      </div>
     
    </div>
  );
}
