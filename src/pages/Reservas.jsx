import { useState, useMemo, useEffect } from "react";
import { useStore } from "../store/useStore";
import { useConfigStore } from "../store/configStore";
import { Eye, Mail, X, FileText, Filter, Search, Users, Calendar, RefreshCw, AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

// Componente para indicador de completitud de campos
const IndicadorCompletitud = ({ reserva, tema }) => {
  const { _validacion } = reserva;

  if (!_validacion) return null;

  const { esValida, esCompleta, camposImportantesFaltantes, camposOpcionalesFaltantes } = _validacion;

  if (!esValida) {
    // Campos importantes faltantes - CRÍTICO
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
        tema === 'claro' ? 'bg-red-100 text-red-800' : 'bg-red-900 text-red-200'
      }`} title="Faltan campos importantes">
        <AlertCircle size={12} />
        Incompleta
      </div>
    );
  } else if (!esCompleta) {
    // Solo campos opcionales faltantes - ADVERTENCIA
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
        tema === 'claro' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900 text-yellow-200'
      }`} title="Campos opcionales faltantes">
        <AlertTriangle size={12} />
        Básica
      </div>
    );
  } else {
    // Todo completo - PERFECTO
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
        tema === 'claro' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200'
      }`} title="Todos los campos completos">
        <CheckCircle size={12} />
        Completa
      </div>
    );
  }
};

export default function Reservas() {
  const { reservasHuespedes, cargarReservas } = useStore();
  const isLoading = useStore((state) => state.isLoading);
  const syncError = useStore((state) => state.syncError);
  const lastSync = useStore((state) => state.lastSync);
  const forzarSincronizacion = useStore((state) => state.forzarSincronizacion);
  const tema = useConfigStore((state) => state.tema);
  const [modalServicios, setModalServicios] = useState(null);
  const [modalCorreo, setModalCorreo] = useState(null);
  const [modalObservaciones, setModalObservaciones] = useState(null);
  const [asuntoCorreo, setAsuntoCorreo] = useState("");
  const [mensajeCorreo, setMensajeCorreo] = useState("");

  // Estados para filtros
  const [filtros, setFiltros] = useState({
    domo: '',
    numeroPersonas: '',
    fechaBusqueda: '',
    nombre: '',
    completitud: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const abrirModalServicios = (servicios) => {
    setModalServicios(servicios);
  };

  const abrirModalCorreo = (huesped) => {
    setModalCorreo(huesped);
    setAsuntoCorreo("");
    setMensajeCorreo("");
  };

  const abrirModalObservaciones = (huesped) => {
    setModalObservaciones(huesped);
  };

  const enviarCorreo = () => {
    if (!asuntoCorreo.trim() || !mensajeCorreo.trim()) {
      alert("Por favor completa el asunto y el mensaje del correo");
      return;
    }
    
    // Simular envío de correo
    alert(`Correo enviado a ${modalCorreo.email}\\n\\nAsunto: ${asuntoCorreo}\\nMensaje: ${mensajeCorreo}`);
    setModalCorreo(null);
    setAsuntoCorreo("");
    setMensajeCorreo("");
  };

  // Función para filtrar reservas - ACTUALIZADA
  const reservasFiltradas = useMemo(() => {
    return reservasHuespedes.filter(reserva => {
      // Filtro por domo
      if (filtros.domo && reserva.domo !== filtros.domo) return false;
      
      // Filtro por número de personas
      if (filtros.numeroPersonas && reserva.numeroPersonas.toString() !== filtros.numeroPersonas) return false;
      
      // Filtro por nombre (búsqueda parcial)
      if (filtros.nombre && !reserva.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())) return false;
      
      // Filtro por fecha (busca si la fecha está dentro del rango de estadía)
      if (filtros.fechaBusqueda) {
        const fechaBusqueda = new Date(filtros.fechaBusqueda);
        const fechaEntrada = new Date(reserva.fechaEntrada);
        const fechaSalida = new Date(reserva.fechaSalida);
        if (fechaBusqueda < fechaEntrada || fechaBusqueda > fechaSalida) return false;
      }

      // NUEVO: Filtro por completitud
      if (filtros.completitud) {
        const validacion = reserva._validacion;
        if (!validacion) return true; // Si no hay validación, mostrar

        switch (filtros.completitud) {
          case 'incompletas':
            return !validacion.esValida;
          case 'basicas':
            return validacion.esValida && !validacion.esCompleta;
          case 'completas':
            return validacion.esCompleta;
          default:
            return true;
        }
      }
      
      return true;
    });
  }, [reservasHuespedes, filtros]);

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      domo: '',
      numeroPersonas: '',
      fechaBusqueda: '',
      nombre: '',
      completitud: ''
    });
  };

  // Cargar reservas al montar el componente con logging mejorado
  useEffect(() => {
    const cargarReservasIniciales = async () => {
      console.log('🔄 Iniciando carga inicial de reservas desde Zustand store...');
      console.log('📊 Estado actual del store:', {
        isLoading,
        syncError,
        totalReservas: reservasHuespedes?.length || 0
      });

      try {
        // Usar la función del store que ya maneja loading y errores
        await cargarReservas();
        console.log(`✅ Reservas cargadas exitosamente: ${reservasHuespedes?.length || 0} registros`);

      } catch (error) {
        console.error('❌ Error en carga inicial de reservas:', error);
        console.error('Detalles del error:', {
          name: error.name,
          message: error.message,
          stack: error.stack?.slice(0, 300) // Solo primeras líneas del stack
        });
      }
    };

    cargarReservasIniciales();
  }, [cargarReservas]); // Agregar cargarReservas como dependencia

  // Debug: Mostrar estructura de datos en consola (solo en desarrollo)
  useEffect(() => {
    if (import.meta.env.DEV && reservasHuespedes.length > 0) {
      console.group('🔍 Debug: Estructura de reservas cargadas');
      console.log('📊 Total de reservas:', reservasHuespedes.length);
      console.log('📋 Primera reserva (estructura):', reservasHuespedes[0]);
      console.log('🏷️ Campos disponibles:', Object.keys(reservasHuespedes[0] || {}));

      // Verificar servicios
      const reservasConServicios = reservasHuespedes.filter(r => r.servicios && r.servicios.length > 0);
      console.log('🛎️ Reservas con servicios:', reservasConServicios.length);

      if (reservasConServicios.length > 0) {
        console.log('🎯 Ejemplo de servicios:', reservasConServicios[0].servicios);
      }

      console.groupEnd();
    }
  }, [reservasHuespedes]);

  // Sincronización en tiempo real - Polling cada 30 segundos (5 segundos en desarrollo para testing)
  useEffect(() => {
    const syncInterval = import.meta.env.DEV ? 5000 : 30000; // 5s dev, 30s prod
    
    const interval = setInterval(() => {
      // Solo sincronizar si no está cargando actualmente
      if (!isLoading) {
        console.log('🔄 Sincronización automática ejecutándose...');
        cargarReservas();
      }
    }, syncInterval);

    console.log(`⏱️ Sincronización configurada cada ${syncInterval/1000} segundos`);

    // Limpiar interval al desmontar componente
    return () => {
      console.log('🛑 Limpiando interval de sincronización');
      clearInterval(interval);
    };
  }, [isLoading, cargarReservas]);

  return (
    <div className={`w-full ${tema === 'claro' ? 'text-gray-900' : 'text-white'}`}>
      {/* Header con filtros */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold">Base de Datos - Huéspedes</h2>
          <div className="flex items-center gap-3">
            {/* Estado de sincronización */}
            {syncError && (
              <div className={`px-3 py-1 rounded text-sm flex items-center gap-2 ${
                tema === 'claro' ? 'bg-red-100 text-red-800' : 'bg-red-900 text-red-200'
              }`}>
                <AlertCircle size={14} />
                Error de conexión
              </div>
            )}
            
            {lastSync && !syncError && (
              <div className={`px-3 py-1 rounded text-sm ${
                tema === 'claro' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200'
              }`}>
                Última sync: {new Date(lastSync).toLocaleTimeString()}
              </div>
            )}

            <div className={`px-3 py-1 rounded text-sm ${
              tema === 'claro' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'
            }`}>
              Mostrando: {reservasFiltradas.length} de {reservasHuespedes.length} reservas
            </div>

            {/* Botón de sincronización */}
            <button
              onClick={() => {
                console.log('🔄 Botón de sincronización manual clickeado');
                forzarSincronizacion();
              }}
              disabled={isLoading}
              className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                isLoading 
                  ? 'opacity-50 cursor-not-allowed'
                  : tema === 'claro' 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              title="Sincronizar con base de datos"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">
                {isLoading ? 'Sincronizando...' : 'Sincronizar'}
              </span>
            </button>
            
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                tema === 'claro' 
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              <Filter size={16} />
              <span className="hidden sm:inline">
                {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </span>
            </button>
          </div>
        </div>

        {/* Panel de filtros */}
        {mostrarFiltros && (
          <div className={`rounded-lg p-4 mb-4 border ${
            tema === 'claro' 
              ? 'bg-gray-50 border-gray-200' 
              : 'bg-gray-800 border-gray-600'
          }`}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Filter size={16} />
              Filtros de Búsqueda
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtro por nombre */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  <Search size={14} className="inline mr-1" />
                  Buscar por nombre
                </label>
                <input
                  type="text"
                  placeholder="Nombre del huésped..."
                  value={filtros.nombre}
                  onChange={(e) => setFiltros({...filtros, nombre: e.target.value})}
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    tema === 'claro' 
                      ? 'border-gray-300 bg-white text-gray-900' 
                      : 'border-gray-600 bg-gray-700 text-white'
                  }`}
                />
              </div>

              {/* Filtro por domo */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  <span className="mr-1">🏨</span>
                  Domo
                </label>
                <select
                  value={filtros.domo}
                  onChange={(e) => setFiltros({...filtros, domo: e.target.value})}
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    tema === 'claro' 
                      ? 'border-gray-300 bg-white text-gray-900' 
                      : 'border-gray-600 bg-gray-700 text-white'
                  }`}
                >
                  <option value="">Todos los domos</option>
                  <option value="Centary">Centary</option>
                  <option value="Polaris">Polaris</option>
                  <option value="Antares">Antares</option>
                  <option value="Sirius">Sirius</option>
                </select>
              </div>

              {/* Filtro por número de personas */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  <Users size={14} className="inline mr-1" />
                  Número de personas
                </label>
                <select
                  value={filtros.numeroPersonas}
                  onChange={(e) => setFiltros({...filtros, numeroPersonas: e.target.value})}
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    tema === 'claro' 
                      ? 'border-gray-300 bg-white text-gray-900' 
                      : 'border-gray-600 bg-gray-700 text-white'
                  }`}
                >
                  <option value="">Cualquier cantidad</option>
                  <option value="1">1 persona</option>
                  <option value="2">2 personas</option>
                  <option value="3">3 personas</option>
                  <option value="4">4 personas</option>
                  <option value="5">5 personas</option>
                  <option value="6">6 personas</option>
                </select>
              </div>

              {/* Filtro por fecha */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  <Calendar size={14} className="inline mr-1" />
                  Fecha específica
                </label>
                <input
                  type="date"
                  value={filtros.fechaBusqueda}
                  onChange={(e) => setFiltros({...filtros, fechaBusqueda: e.target.value})}
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    tema === 'claro' 
                      ? 'border-gray-300 bg-white text-gray-900' 
                      : 'border-gray-600 bg-gray-700 text-white'
                  }`}
                />
                <p className="text-xs mt-1 opacity-75">
                  Busca huéspedes que estén en el glamping en esta fecha
                </p>
              </div>
              
              {/* Filtro por completitud */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  <AlertCircle size={14} className="inline mr-1" />
                  Estado de campos
                </label>
                <select
                  value={filtros.completitud || ''}
                  onChange={(e) => setFiltros({...filtros, completitud: e.target.value})}
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    tema === 'claro'
                      ? 'border-gray-300 bg-white text-gray-900'
                      : 'border-gray-600 bg-gray-700 text-white'
                  }`}
                >
                  <option value="">Todas las reservas</option>
                  <option value="incompletas">Solo incompletas (faltan campos importantes)</option>
                  <option value="basicas">Solo básicas (faltan campos opcionales)</option>
                  <option value="completas">Solo completas</option>
                </select>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={limpiarFiltros}
                className={`px-4 py-2 rounded text-sm transition-colors ${
                  tema === 'claro' 
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vista de tabla para desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <div className={`rounded-lg shadow-lg overflow-hidden ${
          tema === 'claro' ? 'bg-white' : 'bg-gray-800'
        }`}>
          <table className="w-full text-sm">
            <thead className={`${
              tema === 'claro' ? 'bg-gray-50' : 'bg-gray-700'
            }`}>
              <tr>
                <th className="px-2 py-4 text-left font-semibold w-20">ID</th>
                <th className="px-2 py-4 text-left font-semibold w-20 text-center">Estado</th>
                <th className="px-3 py-4 text-left font-semibold w-48">Nombre</th>
                <th className="px-2 py-4 text-left font-semibold w-32">Número</th>
                <th className="px-3 py-4 text-left font-semibold w-48">Email</th>
                <th className="px-2 py-4 text-left font-semibold w-20 text-center">Pers.</th>
                <th className="px-2 py-4 text-left font-semibold w-24">Entrada</th>
                <th className="px-2 py-4 text-left font-semibold w-24">Salida</th>
                <th className="px-3 py-4 text-left font-semibold w-24">Domo</th>
                <th className="px-3 py-4 text-left font-semibold w-24">Servicios</th>
                <th className="px-3 py-4 text-left font-semibold w-28">Monto</th>
                <th className="px-2 py-4 text-left font-semibold w-24">Pago</th>
                <th className="px-3 py-4 text-left font-semibold w-56">Observaciones</th>
                <th className="px-2 py-4 text-left font-semibold w-20">Acción</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map((huesped) => (
                <tr key={huesped.id} className={`border-t ${
                  tema === 'claro' ? 'border-gray-200 hover:bg-gray-50' : 'border-gray-600 hover:bg-gray-700'
                }`}>
                  <td className="px-2 py-4 font-mono text-xs">{huesped.id}</td>
                  <td className="px-2 py-4 text-center">
                    <IndicadorCompletitud reserva={huesped} tema={tema} />
                  </td>
                  <td className="px-3 py-4 font-medium">{huesped.nombre}</td>
                  <td className="px-2 py-4 text-xs">{huesped.numero}</td>
                  <td className="px-3 py-4">
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {huesped.email}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-center font-semibold">{huesped.numeroPersonas}</td>
                  <td className="px-2 py-4">
                    <div className="text-xs">
                      <div className="font-medium">{new Date(huesped.fechaEntrada).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' })}</div>
                      <div className={`text-xs ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(huesped.fechaEntrada).toLocaleDateString('es-CO', { weekday: 'short' })}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-4">
                    <div className="text-xs">
                      <div className="font-medium">{new Date(huesped.fechaSalida).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' })}</div>
                      <div className={`text-xs ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(huesped.fechaSalida).toLocaleDateString('es-CO', { weekday: 'short' })}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      huesped.domo === 'Centary' ? (tema === 'claro' ? 'bg-purple-100 text-purple-800' : 'bg-purple-900 text-purple-200') :
                      huesped.domo === 'Polaris' ? (tema === 'claro' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200') :
                      huesped.domo === 'Antares' ? (tema === 'claro' ? 'bg-orange-100 text-orange-800' : 'bg-orange-900 text-orange-200') :
                      (tema === 'claro' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200')
                    }`}>
                      {huesped.domo}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    {!huesped.servicios || huesped.servicios.length === 0 ? (
                      <div className="flex flex-col">
                        <span className={`text-xs ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Sin servicios
                        </span>
                        {huesped.servicio_elegido && huesped.servicio_elegido !== 'Ninguno' && (
                          <span className="text-xs text-blue-600 mt-1">
                            {huesped.servicio_elegido}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => abrirModalServicios(huesped.servicios)}
                          className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1 text-sm"
                        >
                          <Eye size={14} />
                          {huesped.servicios.length} servicio{huesped.servicios.length !== 1 ? 's' : ''}
                        </button>
                        <span className="text-xs text-green-600 font-medium">
                          ${huesped.servicios.reduce((total, s) => total + (s.precio || 0), 0).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-4 font-medium text-green-600">
                    ${huesped.montoAPagar.toLocaleString()}
                  </td>
                  <td className="px-3 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      huesped.metodoPago === 'Efectivo' ? (tema === 'claro' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200') :
                      huesped.metodoPago === 'Transferencia' ? (tema === 'claro' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200') :
                      (tema === 'claro' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900 text-yellow-200')
                    }`}>
                      {huesped.metodoPago}
                    </span>
                  </td>
                  <td className="px-3 py-4 max-w-56">
                    {huesped.observaciones ? (
                      <div className="flex items-center gap-2">
                        <div className="text-xs truncate flex-1" title={huesped.observaciones}>
                          {huesped.observaciones}
                        </div>
                        <button
                          onClick={() => abrirModalObservaciones(huesped)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs"
                          title="Ver observaciones completas"
                        >
                          <FileText size={12} />
                          ver más
                        </button>
                      </div>
                    ) : (
                      <span className={`text-xs ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Sin observaciones
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-4">
                    <button
                      onClick={() => abrirModalCorreo(huesped)}
                      className={`p-2 rounded hover:scale-110 transition-transform ${
                        tema === 'claro' ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-blue-900 text-blue-400 hover:bg-blue-800'
                      }`}
                      title="Enviar correo"
                    >
                      <Mail size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista de cards para móvil y tablet */}
      <div className="lg:hidden space-y-4">
        {reservasFiltradas.map((huesped) => (
          <div key={huesped.id} className={`rounded-lg shadow-lg p-4 ${
            tema === 'claro' ? 'bg-white' : 'bg-gray-800'
          }`}>
            {/* Header de la card */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">{huesped.nombre}</h3>
                <p className={`text-sm ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {huesped.id}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <IndicadorCompletitud reserva={huesped} tema={tema} />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  huesped.domo === 'Centary' ? (tema === 'claro' ? 'bg-purple-100 text-purple-800' : 'bg-purple-900 text-purple-200') :
                  huesped.domo === 'Polaris' ? (tema === 'claro' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200') :
                  huesped.domo === 'Antares' ? (tema === 'claro' ? 'bg-orange-100 text-orange-800' : 'bg-orange-900 text-orange-200') :
                  (tema === 'claro' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200')
                }`}>
                  {huesped.domo}
                </span>
                <button
                  onClick={() => abrirModalCorreo(huesped)}
                  className={`p-2 rounded hover:scale-110 transition-transform ${
                    tema === 'claro' ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-blue-900 text-blue-400 hover:bg-blue-800'
                  }`}
                  title="Enviar correo"
                >
                  <Mail size={16} />
                </button>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <p className={`text-xs font-medium ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                  CONTACTO
                </p>
                <p className="text-sm">{huesped.numero}</p>
                <p className="text-sm text-blue-600 hover:underline cursor-pointer">
                  {huesped.email}
                </p>
              </div>
              <div>
                <p className={`text-xs font-medium ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                  PERSONAS
                </p>
                <p className="text-sm font-semibold">{huesped.numeroPersonas} huéspedes</p>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className={`text-xs font-medium ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                  ENTRADA
                </p>
                <p className="text-sm font-medium">
                  {new Date(huesped.fechaEntrada).toLocaleDateString('es-CO', { 
                    day: '2-digit', 
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
                <p className={`text-xs ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(huesped.fechaEntrada).toLocaleDateString('es-CO', { weekday: 'long' })}
                </p>
              </div>
              <div>
                <p className={`text-xs font-medium ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                  SALIDA
                </p>
                <p className="text-sm font-medium">
                  {new Date(huesped.fechaSalida).toLocaleDateString('es-CO', { 
                    day: '2-digit', 
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
                <p className={`text-xs ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(huesped.fechaSalida).toLocaleDateString('es-CO', { weekday: 'long' })}
                </p>
              </div>
            </div>

            {/* Servicios y Pago */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <p className={`text-xs font-medium ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                  SERVICIOS
                </p>
                {!huesped.servicios || huesped.servicios.length === 0 ? (
                  <div className="flex flex-col">
                    <span className={`text-sm ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Sin servicios
                    </span>
                    {huesped.servicio_elegido && huesped.servicio_elegido !== 'Ninguno' && (
                      <span className="text-sm text-blue-600 mt-1">
                        {huesped.servicio_elegido}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => abrirModalServicios(huesped.servicios)}
                      className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1 text-sm self-start"
                    >
                      <Eye size={14} />
                      {huesped.servicios.length} servicio{huesped.servicios.length !== 1 ? 's' : ''}
                    </button>
                    <span className="text-sm text-green-600 font-medium">
                      Total: ${huesped.servicios.reduce((total, s) => total + (s.precio || 0), 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className={`text-xs font-medium ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                  PAGO
                </p>
                <p className="text-lg font-bold text-green-600">
                  ${huesped.montoAPagar.toLocaleString()}
                </p>
                <span className={`px-2 py-1 rounded text-xs ${
                  huesped.metodoPago === 'Efectivo' ? (tema === 'claro' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200') :
                  huesped.metodoPago === 'Transferencia' ? (tema === 'claro' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200') :
                  (tema === 'claro' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900 text-yellow-200')
                }`}>
                  {huesped.metodoPago}
                </span>
              </div>
            </div>

            {/* Observaciones */}
            {huesped.observaciones && (
              <div>
                <p className={`text-xs font-medium ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                  OBSERVACIONES
                </p>
                <div className="flex items-start gap-2">
                  <p className="text-sm flex-1 line-clamp-2">
                    {huesped.observaciones.length > 100 
                      ? `${huesped.observaciones.substring(0, 100)}...`
                      : huesped.observaciones
                    }
                  </p>
                  {huesped.observaciones.length > 100 && (
                    <button
                      onClick={() => abrirModalObservaciones(huesped)}
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 flex-shrink-0"
                    >
                      <FileText size={12} />
                      ver más
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Servicios */}
      {modalServicios && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-md w-full mx-4 ${
            tema === 'claro' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Servicios Contratados</h3>
              <button
                onClick={() => setModalServicios(null)}
                className={`p-1 rounded hover:bg-opacity-10 ${
                  tema === 'claro' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'
                }`}
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {modalServicios.map((servicio, index) => (
                <div key={index} className={`p-3 rounded border transition-colors ${
                  tema === 'claro' ? 'border-gray-200 bg-gray-50 hover:bg-gray-100' : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-base">{servicio.nombre || `Servicio ${index + 1}`}</div>
                    <div className="text-lg font-bold text-green-600">
                      ${(servicio.precio || 0).toLocaleString()}
                    </div>
                  </div>
                  {servicio.descripcion && (
                    <div className={`text-sm mt-2 ${tema === 'claro' ? 'text-gray-600' : 'text-gray-300'}`}>
                      {servicio.descripcion}
                    </div>
                  )}
                  <div className={`text-xs mt-2 px-2 py-1 rounded ${
                    tema === 'claro' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900 text-blue-300'
                  }`}>
                    Servicio adicional
                  </div>
                </div>
              ))}
            </div>
            
            {/* Mostrar total de servicios */}
            <div className={`mt-4 p-3 rounded border-t-2 ${
              tema === 'claro' ? 'border-green-200 bg-green-50' : 'border-green-700 bg-green-900/20'
            }`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total servicios:</span>
                <span className="text-xl font-bold text-green-600">
                  ${modalServicios.reduce((total, servicio) => total + (servicio.precio || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Correo */}
      {modalCorreo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-lg w-full mx-4 ${
            tema === 'claro' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Enviar Correo</h3>
              <button
                onClick={() => setModalCorreo(null)}
                className={`p-1 rounded hover:bg-opacity-10 ${
                  tema === 'claro' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'
                }`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Para:</label>
                <div className={`p-2 rounded border ${
                  tema === 'claro' ? 'bg-gray-100 border-gray-300' : 'bg-gray-700 border-gray-600'
                }`}>
                  {modalCorreo.email} ({modalCorreo.nombre})
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Asunto:</label>
                <input
                  type="text"
                  value={asuntoCorreo}
                  onChange={(e) => setAsuntoCorreo(e.target.value)}
                  placeholder="Asunto del correo"
                  className={`w-full p-2 rounded border ${
                    tema === 'claro' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-gray-700'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mensaje:</label>
                <textarea
                  value={mensajeCorreo}
                  onChange={(e) => setMensajeCorreo(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  rows="4"
                  className={`w-full p-2 rounded border resize-none ${
                    tema === 'claro' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-gray-700'
                  }`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={enviarCorreo}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium"
                >
                  Enviar Correo
                </button>
                <button
                  onClick={() => setModalCorreo(null)}
                  className={`px-4 py-2 rounded font-medium ${
                    tema === 'claro' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Observaciones */}
      {modalObservaciones && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto ${
            tema === 'claro' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Observaciones</h3>
              <button
                onClick={() => setModalObservaciones(null)}
                className={`p-1 rounded hover:bg-opacity-10 ${
                  tema === 'claro' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'
                }`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-blue-600 mb-2">
                  {modalObservaciones.nombre} - {modalObservaciones.id}
                </h4>
                <div className={`p-4 rounded border ${
                  tema === 'claro' ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {modalObservaciones.observaciones || 'Sin observaciones registradas.'}
                  </p>
                </div>
              </div>

              {/* Información adicional del huésped */}
              <div className={`p-3 rounded ${
                tema === 'claro' ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-800'
              }`}>
                <h5 className="font-medium text-sm mb-2">Información del huésped:</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Domo:</span>
                    <span className="ml-1 font-medium">{modalObservaciones.domo}</span>
                  </div>
                  <div>
                    <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Personas:</span>
                    <span className="ml-1 font-medium">{modalObservaciones.numeroPersonas}</span>
                  </div>
                  <div>
                    <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Entrada:</span>
                    <span className="ml-1 font-medium">
                      {new Date(modalObservaciones.fechaEntrada).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  <div>
                    <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Salida:</span>
                    <span className="ml-1 font-medium">
                      {new Date(modalObservaciones.fechaSalida).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setModalObservaciones(null)}
                  className={`px-4 py-2 rounded font-medium ${
                    tema === 'claro' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}