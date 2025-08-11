import { useState, useMemo } from "react";
import { useStore } from "../store/useStore";
import { useConfigStore } from "../store/configStore";
import { Eye, Calendar, User, FileText, Filter, Search, X, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function PQRS() {
  const pqrsPendientes = useStore((state) => state.pqrsPendientes);
  const reservasHuespedes = useStore((state) => state.reservasHuespedes);
  const tema = useConfigStore((state) => state.tema);
  
  // Estados para modales y filtros
  const [modalDetalle, setModalDetalle] = useState(null);
  const [filtros, setFiltros] = useState({
    tipo: '',
    estado: '',
    fechaBusqueda: '',
    busqueda: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Función para obtener información del huésped por reservaId
  const obtenerHuesped = (reservaId) => {
    return reservasHuespedes?.find(r => r.id === reservaId) || null;
  };

  // Función para filtrar PQRS
  const pqrsFiltradas = useMemo(() => {
    if (!pqrsPendientes) return [];
    
    return pqrsPendientes.filter(pqr => {
      // Filtro por tipo
      if (filtros.tipo && pqr.tipo !== filtros.tipo) return false;
      
      // Filtro por estado
      if (filtros.estado && pqr.estado !== filtros.estado) return false;
      
      // Filtro por fecha
      if (filtros.fechaBusqueda && pqr.fecha !== filtros.fechaBusqueda) return false;
      
      // Filtro por búsqueda en mensaje
      if (filtros.busqueda && !pqr.mensaje.toLowerCase().includes(filtros.busqueda.toLowerCase())) return false;
      
      return true;
    });
  }, [pqrsPendientes, filtros]);

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      tipo: '',
      estado: '',
      fechaBusqueda: '',
      busqueda: ''
    });
  };

  // Función para obtener color por tipo
  const getColorTipo = (tipo) => {
    const colores = {
      'Queja': tema === 'claro' ? 'bg-red-100 text-red-800' : 'bg-red-900 text-red-200',
      'Reclamo': tema === 'claro' ? 'bg-orange-100 text-orange-800' : 'bg-orange-900 text-orange-200',
      'Sugerencia': tema === 'claro' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200',
      'Petición': tema === 'claro' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200'
    };
    return colores[tipo] || (tema === 'claro' ? 'bg-gray-100 text-gray-800' : 'bg-gray-900 text-gray-200');
  };

  // Función para obtener color por estado
  const getColorEstado = (estado) => {
    const colores = {
      'Pendiente': tema === 'claro' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-900 text-yellow-200',
      'En proceso': tema === 'claro' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200',
      'Resuelto': tema === 'claro' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200'
    };
    return colores[estado] || (tema === 'claro' ? 'bg-gray-100 text-gray-800' : 'bg-gray-900 text-gray-200');
  };

  // Función para obtener icono por estado
  const getIconoEstado = (estado) => {
    switch (estado) {
      case 'Pendiente': return <AlertCircle size={16} />;
      case 'En proceso': return <Clock size={16} />;
      case 'Resuelto': return <CheckCircle size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className={`w-full ${tema === 'claro' ? 'text-gray-900' : 'text-white'}`}>
      {/* Header con filtros */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold">PQRS de Clientes</h2>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded text-sm ${
              tema === 'claro' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'
            }`}>
              Mostrando: {pqrsFiltradas.length} de {pqrsPendientes?.length || 0} PQRS
            </div>
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
              {/* Filtro por búsqueda */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  <Search size={14} className="inline mr-1" />
                  Buscar en mensajes
                </label>
                <input
                  type="text"
                  placeholder="Texto a buscar..."
                  value={filtros.busqueda}
                  onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    tema === 'claro' 
                      ? 'border-gray-300 bg-white text-gray-900' 
                      : 'border-gray-600 bg-gray-700 text-white'
                  }`}
                />
              </div>

              {/* Filtro por tipo */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  <FileText size={14} className="inline mr-1" />
                  Tipo de PQRS
                </label>
                <select
                  value={filtros.tipo}
                  onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    tema === 'claro' 
                      ? 'border-gray-300 bg-white text-gray-900' 
                      : 'border-gray-600 bg-gray-700 text-white'
                  }`}
                >
                  <option value="">Todos los tipos</option>
                  <option value="Queja">Queja</option>
                  <option value="Reclamo">Reclamo</option>
                  <option value="Sugerencia">Sugerencia</option>
                  <option value="Petición">Petición</option>
                </select>
              </div>

              {/* Filtro por estado */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  <CheckCircle size={14} className="inline mr-1" />
                  Estado
                </label>
                <select
                  value={filtros.estado}
                  onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    tema === 'claro' 
                      ? 'border-gray-300 bg-white text-gray-900' 
                      : 'border-gray-600 bg-gray-700 text-white'
                  }`}
                >
                  <option value="">Todos los estados</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Resuelto">Resuelto</option>
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

      {/* Vista de cards para todas las pantallas */}
      <div className="space-y-4">
        {pqrsFiltradas.map((pqr) => {
          const huesped = obtenerHuesped(pqr.reservaId);
          
          return (
            <div key={pqr.id} className={`rounded-lg shadow-lg p-4 border ${
              tema === 'claro' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-600'
            }`}>
              {/* Header de la card */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {getIconoEstado(pqr.estado)}
                    PQRS {pqr.id}
                  </h3>
                  <p className={`text-sm ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {new Date(pqr.fecha).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorTipo(pqr.tipo)}`}>
                    {pqr.tipo}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorEstado(pqr.estado)}`}>
                    {pqr.estado}
                  </span>
                </div>
              </div>

              {/* Información del huésped */}
              {huesped && (
                <div className={`p-3 rounded mb-3 ${
                  tema === 'claro' ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-800'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <User size={16} />
                    <span className="font-medium">{huesped.nombre}</span>
                    <span className={`text-sm ${tema === 'claro' ? 'text-blue-600' : 'text-blue-400'}`}>
                      ({pqr.reservaId})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Domo:</span>
                      <span className="ml-1 font-medium">{huesped.domo}</span>
                    </div>
                    <div>
                      <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Contacto:</span>
                      <span className="ml-1 font-medium">{huesped.numero}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mensaje */}
              <div className="mb-3">
                <p className="text-sm leading-relaxed">
                  {pqr.mensaje.length > 150 
                    ? `${pqr.mensaje.substring(0, 150)}...`
                    : pqr.mensaje
                  }
                </p>
              </div>

              {/* Botón ver más */}
              <div className="flex justify-end">
                <button
                  onClick={() => setModalDetalle(pqr)}
                  className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1 text-sm"
                >
                  <Eye size={14} />
                  Ver detalles completos
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensaje si no hay PQRS */}
      {pqrsFiltradas.length === 0 && (
        <div className={`text-center py-8 ${
          tema === 'claro' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No se encontraron PQRS</p>
          <p className="text-sm">
            {filtros.tipo || filtros.estado || filtros.busqueda || filtros.fechaBusqueda
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'No hay PQRS registradas en el sistema'
            }
          </p>
        </div>
      )}

      {/* Modal de detalle */}
      {modalDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto ${
            tema === 'claro' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                {getIconoEstado(modalDetalle.estado)}
                PQRS {modalDetalle.id} - Detalles Completos
              </h3>
              <button
                onClick={() => setModalDetalle(null)}
                className={`p-1 rounded hover:bg-opacity-10 ${
                  tema === 'claro' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'
                }`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Información del PQRS */}
              <div className={`p-4 rounded border ${
                tema === 'claro' ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
              }`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className={`text-sm font-medium ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Tipo:</span>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorTipo(modalDetalle.tipo)}`}>
                        {modalDetalle.tipo}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Estado:</span>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorEstado(modalDetalle.estado)}`}>
                        {modalDetalle.estado}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Fecha:</span>
                    <p className="text-sm font-medium mt-1">
                      {new Date(modalDetalle.fecha).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Reserva:</span>
                    <p className="text-sm font-medium mt-1 text-blue-600">{modalDetalle.reservaId}</p>
                  </div>
                </div>
                
                <div>
                  <span className={`text-sm font-medium ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Mensaje completo:</span>
                  <p className="text-sm leading-relaxed mt-2 whitespace-pre-wrap">
                    {modalDetalle.mensaje}
                  </p>
                </div>
              </div>

              {/* Información del huésped */}
              {obtenerHuesped(modalDetalle.reservaId) && (
                <div className={`p-4 rounded ${
                  tema === 'claro' ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-800'
                }`}>
                  <h5 className="font-medium text-sm mb-3">Información del huésped:</h5>
                  {(() => {
                    const huesped = obtenerHuesped(modalDetalle.reservaId);
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Nombre:</span>
                          <span className="ml-1 font-medium">{huesped.nombre}</span>
                        </div>
                        <div>
                          <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Email:</span>
                          <span className="ml-1 font-medium">{huesped.email}</span>
                        </div>
                        <div>
                          <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Teléfono:</span>
                          <span className="ml-1 font-medium">{huesped.numero}</span>
                        </div>
                        <div>
                          <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Domo:</span>
                          <span className="ml-1 font-medium">{huesped.domo}</span>
                        </div>
                        <div>
                          <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Entrada:</span>
                          <span className="ml-1 font-medium">
                            {new Date(huesped.fechaEntrada).toLocaleDateString('es-CO')}
                          </span>
                        </div>
                        <div>
                          <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Salida:</span>
                          <span className="ml-1 font-medium">
                            {new Date(huesped.fechaSalida).toLocaleDateString('es-CO')}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setModalDetalle(null)}
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