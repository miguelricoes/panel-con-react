import { useStore } from "../store/useStore";
import { useConfigStore } from "../store/configStore";

export default function Sidebar() {
  const setPaginaActual = useStore((state) => state.setPaginaActual);
  const paginaActual = useStore((state) => state.paginaActual);
  const tema = useConfigStore((state) => state.tema);
  const setTema = useConfigStore((state) => state.setTema);

  const paginas = [
    { id: "inicio", label: "Inicio" },
    { id: "usuarios", label: "Usuarios" },
    { id: "calendario", label: "Calendario" },
    { id: "reservas", label: "Reservas" },
    { id: "pqrs", label: "PQRS" },
  ];

  return (
    <aside className={`w-16 sm:w-64 p-2 sm:p-4 flex flex-col ${tema === 'claro' ? 'bg-white text-gray-900 border-r border-gray-200' : 'bg-gray-800 text-white'}`}>
      {/* Navegación principal */}
      <nav className="flex flex-col gap-2 sm:gap-4 flex-1">
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

      {/* Botón cambiar tema */}
      <div className={`mt-4 pt-4 border-t ${tema === 'claro' ? 'border-gray-200' : 'border-gray-600'}`}>
        <button
          onClick={() => setTema(tema === 'claro' ? 'oscuro' : 'claro')}
          className={`w-full text-left px-2 sm:px-4 py-2 rounded text-xs sm:text-base transition-colors ${
            tema === 'claro' 
              ? 'hover:bg-gray-100 text-gray-700' 
              : 'hover:bg-gray-700 text-gray-300'
          }`}
          title={`Cambiar a tema ${tema === 'claro' ? 'oscuro' : 'claro'}`}
        >
          <span className="hidden sm:inline">
            {tema === 'claro' ? '🌙 Tema Oscuro' : '☀️ Tema Claro'}
          </span>
          <span className="sm:hidden">
            {tema === 'claro' ? '🌙' : '☀️'}
          </span>
        </button>
      </div>
    </aside>
  );
}
