import { useStore } from "@/store/useStore";
import { useConfigStore } from "@/store/configStore";

export default function Sidebar() {
  const setPaginaActual = useStore((state) => state.setPaginaActual);
  const paginaActual = useStore((state) => state.paginaActual);
  const tema = useConfigStore((state) => state.tema);

  const paginas = [
    { id: "inicio", label: "Inicio" },
    { id: "usuarios", label: "Usuarios" },
    { id: "reserva", label: "Reservas" },
    { id: "pqrs", label: "PQRS" },
    { id: "chathistory", label: "Chat History" },
    { id: "configuracion", label: "Configuración" },
  ];

  return (
    <aside className={`w-64 p-4 ${tema === 'claro' ? 'bg-white text-gray-900 border-r border-gray-200' : 'bg-gray-800 text-white'}`}>
      <nav className="flex flex-col gap-4">
        {paginas.map((p) => (
          <button
            key={p.id}
            onClick={() => setPaginaActual(p.id)}
            className={`text-left px-4 py-2 rounded ${
              tema === 'claro' 
                ? (paginaActual === p.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100")
                : (paginaActual === p.id ? "bg-gray-700" : "hover:bg-gray-700")
            }`}
          >
            {p.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
