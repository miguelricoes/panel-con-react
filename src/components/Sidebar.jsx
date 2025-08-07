import { useStore } from "../store/useStore";
import { useConfigStore } from "../store/configStore";

export default function Sidebar() {
  const setPaginaActual = useStore((state) => state.setPaginaActual);
  const paginaActual = useStore((state) => state.paginaActual);
  const tema = useConfigStore((state) => state.tema);

  const paginas = [
    { id: "inicio", label: "Inicio" },
    { id: "usuarios", label: "Usuarios" },
    { id: "calendario", label: "Calendario" },
    { id: "reservas", label: "Reservas" },
    { id: "pqrs", label: "PQRS" },
  ];

  return (
    <aside className={`w-16 sm:w-64 p-2 sm:p-4 ${tema === 'claro' ? 'bg-white text-gray-900 border-r border-gray-200' : 'bg-gray-800 text-white'}`}>
      <nav className="flex flex-col gap-2 sm:gap-4">
        {paginas.map((p) => (
          <button
            key={p.id}
            onClick={() => setPaginaActual(p.id)}
            className={`text-left px-2 sm:px-4 py-2 rounded text-xs sm:text-base ${
              tema === 'claro' 
                ? (paginaActual === p.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100")
                : (paginaActual === p.id ? "bg-gray-700" : "hover:bg-gray-700")
            }`}
            title={p.label}
          >
            <span className="hidden sm:inline">{p.label}</span>
            <span className="sm:hidden">
              {p.id === 'inicio' && '🏠'}
              {p.id === 'usuarios' && '👥'}
              {p.id === 'calendario' && '📅'}
              {p.id === 'reservas' && '🏨'}
              {p.id === 'pqrs' && '📝'}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
