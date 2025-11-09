import React from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/inicio.css";

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="inicio-container">
      <div className="inicio-box">
        <h1 className="inicio-title">🗝️ Aventura Lógica</h1>
        <button
          onClick={() => navigate("/juego")}
          className="inicio-button"
        >
          Iniciar Aventura
        </button>
      </div>
    </div>
  );
}
