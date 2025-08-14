import { useStore } from "../store/useStore";
import { useConfigStore } from "../store/configStore";

export default function Sidebar({ userRole = 'limitado', userName = 'Usuario' }) {
  const setPaginaActual = useStore((state) => state.setPaginaActual);
  const paginaActual = useStore((state) => state.paginaActual);
  const tema = useConfigStore((state) => state.tema);
  const setTema = useConfigStore((state) => state.setTema);

  // Páginas según el rol del usuario
  const paginasCompletas = [
    { id: "inicio", label: "Dashboard", icon: "🏠" },
    { id: "usuarios", label: "Usuarios", icon: "👥" },
    { id: "calendario", label: "Calendario", icon: "📅" },
    { id: "reservas", label: "Reservas", icon: "🏨" },
    { id: "pqrs", label: "PQRS", icon: "📝" },
  ];

  const paginasLimitadas = [
    { id: "inicio", label: "Dashboard", icon: "🏠" },
    { id: "calendario", label: "Calendario", icon: "📅" },
    { id: "reservas", label: "Reservas", icon: "🏨" },
  ];

  const paginas = userRole === 'completo' ? paginasCompletas : paginasLimitadas;

  return (
    <aside className={`w-16 sm:w-64 p-2 sm:p-4 flex flex-col ${tema === 'claro' ? 'bg-white text-gray-900 border-r border-gray-200' : 'bg-gray-800 text-white'}`}>
      {/* Navegación principal */}
      <nav className="flex flex-col gap-2 sm:gap-4 flex-1">
        {paginas.map((p) => (
          <button
            key={p.id}
            onClick={() => setPaginaActual(p.id)}
            className={`text-left px-2 sm:px-4 py-2 rounded text-xs sm:text-base flex items-center gap-2 ${
              tema === 'claro' 
                ? (paginaActual === p.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100")
                : (paginaActual === p.id ? "bg-gray-700" : "hover:bg-gray-700")
            }`}
            title={p.label}
          >
            <span className="text-lg">{p.icon}</span>
            <span className="hidden sm:inline">{p.label}</span>
          </button>
        ))}
      </nav>

      {/* Información del usuario */}
      <div className={`mt-4 pt-4 border-t ${tema === 'claro' ? 'border-gray-200' : 'border-gray-600'}`}>
        <div className={`px-2 sm:px-4 py-2 rounded text-xs ${
          tema === 'claro' ? 'bg-gray-50 text-gray-600' : 'bg-gray-700 text-gray-300'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-sm">{userRole === 'completo' ? '👑' : '👤'}</span>
            <div className="hidden sm:block flex-1 min-w-0">
              <div className="font-medium text-xs truncate">{userName}</div>
              <div className="text-xs opacity-75">
                {userRole === 'completo' ? 'Administrador' : 'Empleado'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón cambiar tema */}
      <div className={`mt-2 ${tema === 'claro' ? '' : ''}`}>
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
