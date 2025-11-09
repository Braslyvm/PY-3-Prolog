export async function obtenerLugares() {
  const res = await fetch("/api/lugares");
  return await res.json();
}
