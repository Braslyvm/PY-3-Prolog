import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { obtenerInventario } from "../api/prologApi";


const InventarioPanel = forwardRef(({ onError }: { onError: (m: string) => void }, ref) => {
  const [inv, setInv] = useState<string[]>([]);

  const refrescar = () => {
    obtenerInventario()
      .then((d) => setInv(d.inventario || []))
      .catch((e) => onError("Error leyendo inventario: " + e.message));
  };

 
  useEffect(() => {
    refrescar();
  }, []);


  useImperativeHandle(ref, () => ({ refrescar }));

  return (
    <div className="panel-inventario">
      <h3>🎒 Inventario</h3>
      {inv.length === 0 ? <p>(vacío)</p> : (
        <ul>{inv.map((x) => <li key={x}>{x}</li>)}</ul>
      )}
    </div>
  );
});

export default InventarioPanel;
