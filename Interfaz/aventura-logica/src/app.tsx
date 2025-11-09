import React from "react";
import { Routes, Route } from "react-router-dom";
import Inicio from "./componets/Inicio";
import ContenedorJuego from "./Context/ContenedorJuego";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/juego" element={<ContenedorJuego />} />
    </Routes>
  );
}

export default App;
