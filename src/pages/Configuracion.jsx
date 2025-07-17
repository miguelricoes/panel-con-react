// src/pages/Configuracion.jsx
import { useConfigStore } from "@/store/configStore";

export default function Configuracion() {
  const {
    modoIA,
    zonaHoraria,
    tema,
    setModoIA,
    setZonaHoraria,
    setTema,
  } = useConfigStore();

  return (
    <div className="text-white space-y-6">
      <h2 className="text-2xl font-bold">Configuración del sistema</h2>

      {/* Configuración del Agente IA */}
      <div className="bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Agente IA</h3>
        <label className="block mb-2">
          Modo de respuesta:
          <select
            value={modoIA}
            onChange={(e) => setModoIA(e.target.value)}
            className="ml-2 text-black px-2 py-1 rounded"
          >
            <option value="amigable">Amigable</option>
            <option value="profesional">Profesional</option>
            <option value="rápido">Rápido</option>
          </select>
        </label>
      </div>

      {/* Configuración de Sistema */}
      <div className="bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Sistema</h3>
        <label className="block mb-2">
          Zona horaria:
          <input
            type="text"
            value={zonaHoraria}
            onChange={(e) => setZonaHoraria(e.target.value)}
            className="ml-2 text-black px-2 py-1 rounded"
          />
        </label>
      </div>

      {/* Apariencia */}
      <div className="bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Apariencia</h3>
        <label className="block mb-2">
          Tema:
          <select
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="ml-2 text-black px-2 py-1 rounded"
          >
            <option value="oscuro">Oscuro</option>
            <option value="claro">Claro</option>
          </select>
        </label>
      </div>
    </div>
  );
}
