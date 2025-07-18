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
    <div className={`space-y-6 ${tema === 'claro' ? 'text-gray-900' : 'text-white'}`}>
      <h2 className="text-2xl font-bold">Configuración del sistema</h2>

      {/* Configuración del Agente IA */}
      <div className={`p-4 rounded shadow ${tema === 'claro' ? 'bg-white border border-gray-200' : 'bg-gray-800'}`}>
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
      <div className={`p-4 rounded shadow ${tema === 'claro' ? 'bg-white border border-gray-200' : 'bg-gray-800'}`}>
        <h3 className="font-semibold mb-2">Sistema</h3>
        <label className="block mb-2">
          Zona horaria:
          <select
            value={zonaHoraria}
            onChange={(e) => setZonaHoraria(e.target.value)}
            className="ml-2 text-black px-2 py-1 rounded"
          >
            <option value="Colombia - Bogotá">Colombia - Bogotá</option>
            <option value="México - Ciudad de México">México - Ciudad de México</option>
            <option value="Argentina - Buenos Aires">Argentina - Buenos Aires</option>
            <option value="Chile - Santiago">Chile - Santiago</option>
            <option value="Perú - Lima">Perú - Lima</option>
            <option value="Venezuela - Caracas">Venezuela - Caracas</option>
            <option value="Ecuador - Quito">Ecuador - Quito</option>
            <option value="Uruguay - Montevideo">Uruguay - Montevideo</option>
            <option value="Paraguay - Asunción">Paraguay - Asunción</option>
            <option value="Bolivia - La Paz">Bolivia - La Paz</option>
            <option value="Brasil - Brasilia">Brasil - Brasilia</option>
            <option value="Costa Rica - San José">Costa Rica - San José</option>
            <option value="Panamá - Ciudad de Panamá">Panamá - Ciudad de Panamá</option>
            <option value="Guatemala - Ciudad de Guatemala">Guatemala - Ciudad de Guatemala</option>
            <option value="Honduras - Tegucigalpa">Honduras - Tegucigalpa</option>
            <option value="Nicaragua - Managua">Nicaragua - Managua</option>
            <option value="El Salvador - San Salvador">El Salvador - San Salvador</option>
            <option value="República Dominicana - Santo Domingo">República Dominicana - Santo Domingo</option>
            <option value="Cuba - La Habana">Cuba - La Habana</option>
            <option value="Puerto Rico - San Juan">Puerto Rico - San Juan</option>
          </select>
        </label>
      </div>

      {/* Apariencia */}
      <div className={`p-4 rounded shadow ${tema === 'claro' ? 'bg-white border border-gray-200' : 'bg-gray-800'}`}>
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
