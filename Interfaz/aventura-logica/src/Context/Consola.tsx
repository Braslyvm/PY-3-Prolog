interface ConsolaProps {
  mensajes: string[];
}

export default function Consola({ mensajes }: ConsolaProps) {
  return (
    <div className="consola">
      <h4>🖥️ CONSOLA DEL SISTEMA</h4>
      <div className="mensajes">
        {mensajes.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
    </div>
  );
}
