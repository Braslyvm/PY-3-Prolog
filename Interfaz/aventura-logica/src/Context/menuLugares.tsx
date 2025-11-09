import React, { useEffect, useState } from "react";
import { obtenerLugares } from "../api/prologApi";

// 🧩 Define el tipo de dato que devuelve el backend
interface Lugar {
  nombre: string;
  descripcion: string;
}

export default function MenuLugares() {
  
  const [lugares, setLugares] = useState<Lugar[]>([]);

  useEffect(() => {
    obtenerLugares()
      .then((data) => setLugares(data.lugares || []))
      .catch((err) => console.error("Error cargando lugares:", err));
  }, []);

  return (
    <div className="menu-lugares">
      <h3>Lugares disponibles:</h3>
      <ul>
        {lugares.map((lugar) => (
          <li key={lugar.nombre}>
            <strong>{lugar.nombre.toUpperCase()}</strong> — {lugar.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}
