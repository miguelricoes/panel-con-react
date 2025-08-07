// src/pages/Inicio.jsx
import { useStore } from "../store/useStore";
import { useConfigStore } from "../store/configStore";
import { Calendar, Users, FileText, AlertTriangle, TrendingUp, MapPin } from "lucide-react";

export default function Inicio() {
  const reservasHuespedes = useStore((state) => state.reservasHuespedes);
  const pqrsPendientes = useStore((state) => state.pqrsPendientes);
  const diasReservados = useStore((state) => state.diasReservados);
  const tema = useConfigStore((state) => state.tema);

  // Calcular estadísticas
  const totalReservas = reservasHuespedes.length;
  const reservasActivas = reservasHuespedes.filter(r => {
    const hoy = new Date();
    const entrada = new Date(r.fechaEntrada);
    const salida = new Date(r.fechaSalida);
    return hoy >= entrada && hoy <= salida;
  }).length;

  const reservasProximas = reservasHuespedes.filter(r => {
    const hoy = new Date();
    const entrada = new Date(r.fechaEntrada);
    const diferenciaDias = Math.ceil((entrada - hoy) / (1000 * 60 * 60 * 24));
    return diferenciaDias > 0 && diferenciaDias <= 7;
  }).length;

  const pqrsPorEstado = {
    pendiente: pqrsPendientes.filter(p => p.estado === 'Pendiente').length,
    proceso: pqrsPendientes.filter(p => p.estado === 'En proceso').length,
    resuelto: pqrsPendientes.filter(p => p.estado === 'Resuelto').length
  };

  const ingresosTotales = reservasHuespedes.reduce((total, r) => total + r.montoAPagar, 0);
  
  const domasOcupados = [...new Set(diasReservados.map(d => d.huesped.domo))].length;
  const domasDisponibles = 4 - domasOcupados; // Hay 4 domos: Centary, Polaris, Antares, Sirius

  return (
    <div className={`w-full ${tema === 'claro' ? 'text-gray-900' : 'text-white'}`}>
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Panel de Administración</h2>
        <p className={`text-sm sm:text-base ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
          Resumen general del glamping
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Total Reservas */}
        <div className={`rounded-lg p-4 sm:p-6 shadow-lg ${
          tema === 'claro' ? 'bg-white border border-gray-200' : 'bg-gray-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 sm:p-3 rounded-full ${
              tema === 'claro' ? 'bg-blue-100' : 'bg-blue-900/30'
            }`}>
              <Users className={`w-5 h-5 sm:w-6 sm:h-6 ${
                tema === 'claro' ? 'text-blue-600' : 'text-blue-400'
              }`} />
            </div>
            <span className="text-2xl sm:text-3xl font-bold">{totalReservas}</span>
          </div>
          <h3 className="font-semibold text-sm sm:text-base">Total Reservas</h3>
          <p className={`text-xs sm:text-sm ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
            Huéspedes registrados
          </p>
        </div>

        {/* Reservas Activas */}
        <div className={`rounded-lg p-4 sm:p-6 shadow-lg ${
          tema === 'claro' ? 'bg-white border border-gray-200' : 'bg-gray-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 sm:p-3 rounded-full ${
              tema === 'claro' ? 'bg-green-100' : 'bg-green-900/30'
            }`}>
              <Calendar className={`w-5 h-5 sm:w-6 sm:h-6 ${
                tema === 'claro' ? 'text-green-600' : 'text-green-400'
              }`} />
            </div>
            <span className="text-2xl sm:text-3xl font-bold">{reservasActivas}</span>
          </div>
          <h3 className="font-semibold text-sm sm:text-base">Activas Hoy</h3>
          <p className={`text-xs sm:text-sm ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
            Huéspedes en el glamping
          </p>
        </div>

        {/* PQRS Pendientes */}
        <div className={`rounded-lg p-4 sm:p-6 shadow-lg ${
          tema === 'claro' ? 'bg-white border border-gray-200' : 'bg-gray-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 sm:p-3 rounded-full ${
              tema === 'claro' ? 'bg-yellow-100' : 'bg-yellow-900/30'
            }`}>
              <FileText className={`w-5 h-5 sm:w-6 sm:h-6 ${
                tema === 'claro' ? 'text-yellow-600' : 'text-yellow-400'
              }`} />
            </div>
            <span className="text-2xl sm:text-3xl font-bold">{pqrsPorEstado.pendiente}</span>
          </div>
          <h3 className="font-semibold text-sm sm:text-base">PQRS Pendientes</h3>
          <p className={`text-xs sm:text-sm ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
            Requieren atención
          </p>
        </div>

        {/* Ingresos Totales */}
        <div className={`rounded-lg p-4 sm:p-6 shadow-lg ${
          tema === 'claro' ? 'bg-white border border-gray-200' : 'bg-gray-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 sm:p-3 rounded-full ${
              tema === 'claro' ? 'bg-purple-100' : 'bg-purple-900/30'
            }`}>
              <TrendingUp className={`w-5 h-5 sm:w-6 sm:h-6 ${
                tema === 'claro' ? 'text-purple-600' : 'text-purple-400'
              }`} />
            </div>
            <span className="text-lg sm:text-xl font-bold">
              ${(ingresosTotales / 1000000).toFixed(1)}M
            </span>
          </div>
          <h3 className="font-semibold text-sm sm:text-base">Ingresos Totales</h3>
          <p className={`text-xs sm:text-sm ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
            ${ingresosTotales.toLocaleString()} COP
          </p>
        </div>
      </div>

      {/* Dashboard secundario */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Estado de los domos */}
        <div className={`rounded-lg p-4 sm:p-6 shadow-lg ${
          tema === 'claro' ? 'bg-white border border-gray-200' : 'bg-gray-800'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <MapPin className={`w-5 h-5 ${tema === 'claro' ? 'text-blue-600' : 'text-blue-400'}`} />
            <h3 className="font-semibold text-lg">Estado de Domos</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
                Ocupados
              </span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{domasOcupados}/4</span>
                <div className={`w-3 h-3 rounded-full ${
                  domasOcupados > 0 ? 'bg-red-500' : 'bg-green-500'
                }`}></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
                Disponibles
              </span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{domasDisponibles}/4</span>
                <div className={`w-3 h-3 rounded-full ${
                  domasDisponibles > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              </div>
            </div>
            <div className="pt-2">
              <div className={`w-full bg-gray-200 rounded-full h-2 ${
                tema === 'claro' ? 'bg-gray-200' : 'bg-gray-700'
              }`}>
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(domasOcupados / 4) * 100}%` }}
                ></div>
              </div>
              <p className={`text-xs mt-1 ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                {Math.round((domasOcupados / 4) * 100)}% ocupación
              </p>
            </div>
          </div>
        </div>

        {/* Próximas llegadas */}
        <div className={`rounded-lg p-4 sm:p-6 shadow-lg ${
          tema === 'claro' ? 'bg-white border border-gray-200' : 'bg-gray-800'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <Calendar className={`w-5 h-5 ${tema === 'claro' ? 'text-green-600' : 'text-green-400'}`} />
            <h3 className="font-semibold text-lg">Próximas Llegadas</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
                Esta semana
              </span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{reservasProximas}</span>
                <div className={`w-3 h-3 rounded-full ${
                  reservasProximas > 0 ? 'bg-orange-500' : 'bg-gray-400'
                }`}></div>
              </div>
            </div>
            {reservasProximas > 0 && (
              <div className={`p-3 rounded ${
                tema === 'claro' ? 'bg-orange-50 border border-orange-200' : 'bg-orange-900/20 border border-orange-800'
              }`}>
                <p className={`text-xs ${tema === 'claro' ? 'text-orange-800' : 'text-orange-200'}`}>
                  ⚠️ {reservasProximas} reserva{reservasProximas > 1 ? 's' : ''} próxima{reservasProximas > 1 ? 's' : ''} requiere{reservasProximas === 1 ? '' : 'n'} preparación
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estado PQRS */}
      <div className={`rounded-lg p-4 sm:p-6 shadow-lg mb-8 ${
        tema === 'claro' ? 'bg-white border border-gray-200' : 'bg-gray-800'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <FileText className={`w-5 h-5 ${tema === 'claro' ? 'text-purple-600' : 'text-purple-400'}`} />
          <h3 className="font-semibold text-lg">Estado de PQRS</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-4 rounded text-center ${
            tema === 'claro' ? 'bg-yellow-50 border border-yellow-200' : 'bg-yellow-900/20 border border-yellow-800'
          }`}>
            <div className="text-2xl font-bold text-yellow-600">{pqrsPorEstado.pendiente}</div>
            <div className={`text-sm ${tema === 'claro' ? 'text-yellow-800' : 'text-yellow-200'}`}>
              Pendientes
            </div>
          </div>
          <div className={`p-4 rounded text-center ${
            tema === 'claro' ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-800'
          }`}>
            <div className="text-2xl font-bold text-blue-600">{pqrsPorEstado.proceso}</div>
            <div className={`text-sm ${tema === 'claro' ? 'text-blue-800' : 'text-blue-200'}`}>
              En proceso
            </div>
          </div>
          <div className={`p-4 rounded text-center ${
            tema === 'claro' ? 'bg-green-50 border border-green-200' : 'bg-green-900/20 border border-green-800'
          }`}>
            <div className="text-2xl font-bold text-green-600">{pqrsPorEstado.resuelto}</div>
            <div className={`text-sm ${tema === 'claro' ? 'text-green-800' : 'text-green-200'}`}>
              Resueltos
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
