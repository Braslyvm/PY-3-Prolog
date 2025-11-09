import React from "react";
import "../estilos/juego.css";
import MenuLugares from "./menuLugares"; // ✅ Import correcto

export default function ContenedorJuego() {
  return (
    <div className="juego-fondo">
      <div className="panel-superior">
        <h2>Mundo Misterioso</h2>
      </div>

      <div className="panel-principal">
        <MenuLugares />  {/* ✅ Aquí se renderiza el componente */}
        <p>Bienvenido al juego. Explora los lugares y resuelve los misterios.</p>
      </div>
    </div>
  );
}
