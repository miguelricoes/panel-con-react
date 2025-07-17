import { useStore } from "@/store/useStore";

export default function Sidebar() {
  const setPaginaActual = useStore((state) => state.setPaginaActual);
  const paginaActual = useStore((state) => state.paginaActual);

  const paginas = [
    { id: "inicio", label: "Inicio" },
    { id: "usuarios", label: "Usuarios" },
    { id: "reserva", label: "Reservas" },
    { id: "pqrs", label: "PQRS" },
    { id: "configuracion", label: "Configuración" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <nav className="flex flex-col gap-4">
        {paginas.map((p) => (
          <button
            key={p.id}
            onClick={() => setPaginaActual(p.id)}
            className={`text-left px-4 py-2 rounded ${
              paginaActual === p.id ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            {p.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
