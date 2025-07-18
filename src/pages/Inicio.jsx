// src/pages/Inicio.jsx
import { useStore } from "@/store/useStore";
import { useConfigStore } from "@/store/configStore";

export default function Inicio() {
  const notificaciones = useStore((state) => state.notificaciones);
  const tema = useConfigStore((state) => state.tema);

  return (
    <div className={tema === 'claro' ? 'text-gray-900' : 'text-white'}>
      <h2 className="text-2xl font-bold mb-4">Bienvenido al panel</h2>

      <h3 className="text-xl font-semibold mb-2">Notificaciones recientes</h3>
      <div className="space-y-3">
        {notificaciones.length === 0 && <p>No hay notificaciones aún.</p>}
        {notificaciones.map((n) => (
          <div
            key={n.id}
            className={`rounded p-4 shadow flex items-start gap-4 ${
              tema === 'claro' 
                ? 'bg-white border border-gray-200' 
                : 'bg-gray-800'
            }`}
          >
            <div className="text-blue-400 font-bold">{n.tipo}</div>
            <div className="flex-1">
              <p>{n.mensaje}</p>
              <p className={`text-sm ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>{n.fecha}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
