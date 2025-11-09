import { useNavigate } from "react-router-dom";

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-green-400 font-mono">
      <h1 className="text-4xl mb-4">🗝️ Aventura Lógica</h1>
      <p className="text-lg mb-6">Presiona ENTER para comenzar...</p>
      <button
        onClick={() => navigate("/juego")}
        className="bg-green-600 px-6 py-2 rounded hover:bg-green-500 text-black font-bold"
      >
        Iniciar Aventura
      </button>
    </div>
  );
}
