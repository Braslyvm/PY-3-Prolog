export async function obtenerLugares() {
  const res = await fetch("/api/lugares");
  return await res.json();
}
export async function tomar(objeto: string) {
  const res = await fetch(`/api/tomar/${encodeURIComponent(objeto)}`);
  return res.json();
}

export async function usar(objeto: string) {
  const res = await fetch(`/api/usar/${encodeURIComponent(objeto)}`);
  return res.json();
}

export async function mover(lugar: string) {
  const res = await fetch(`/api/mover/${encodeURIComponent(lugar)}`);
  return res.json();
}

export async function obtenerInventario() {
  const res = await fetch(`/api/inventario`);
  return res.json();
}

export async function verificarGane() {
  const res = await fetch(`/api/gane`);
  return res.json();
}

export async function ubicacion() {
  try {
    const res = await fetch(`/api/jugador`);
    if (!res.ok) throw new Error("Error al obtener la ubicación actual");

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ Error en ubicacion():", err);
    return { status: "error", message: String(err) };
  }
}
