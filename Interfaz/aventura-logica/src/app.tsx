import { Routes, Route } from "react-router-dom";
import Inicio from "./componets/Inicio";          // 👈 carpeta tal como la tienes
//import GamePage from "./pages/GamePage";          // cuando agregues esta carpeta
//import Resultado from "./componets/Resultado";    // también en componets

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
     
    </Routes>
  );
}

export default App;
