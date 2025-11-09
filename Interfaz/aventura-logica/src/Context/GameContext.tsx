import React, { createContext, useState, useContext, ReactNode } from "react";

interface GameContextProps {
  inventario: string[];
  setInventario: (i: string[]) => void;
  mensajes: string[];
  pushMensaje: (msg: string) => void;
  jugador: string;
  setJugador: (j: string) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [inventario, setInventario] = useState<string[]>([]);
  const [mensajes, setMensajes] = useState<string[]>([]);
  const [jugador, setJugador] = useState<string>("bosque");

  const pushMensaje = (msg: string) => setMensajes(prev => [...prev, msg]);

  return (
    <GameContext.Provider
      value={{ inventario, setInventario, mensajes, pushMensaje, jugador, setJugador }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame debe usarse dentro de GameProvider");
  return ctx;
};
