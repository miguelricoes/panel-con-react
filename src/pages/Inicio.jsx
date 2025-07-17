// src/pages/Inicio.jsx
import { useStore } from "@/store/useStore";

export default function Inicio() {
  const notificaciones = useStore((state) => state.notificaciones);

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">Bienvenido al panel</h2>

      <h3 className="text-xl font-semibold mb-2">Notificaciones recientes</h3>
      <div className="space-y-3">
        {notificaciones.length === 0 && <p>No hay notificaciones aún.</p>}
        {notificaciones.map((n) => (
          <div
            key={n.id}
            className="bg-gray-800 rounded p-4 shadow flex items-start gap-4"
          >
            <div className="text-blue-400 font-bold">{n.tipo}</div>
            <div className="flex-1">
              <p>{n.mensaje}</p>
              <p className="text-sm text-gray-400">{n.fecha}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
