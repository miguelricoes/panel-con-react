import { useState } from "react";
import { useStore } from "../store/useStore";
import { useConfigStore } from "../store/configStore";
import { Eye, Calendar, User, FileText } from "lucide-react";

export default function PQRS() {
  const pqrsPendientes = useStore((state) => state.pqrsPendientes);
  const reservasHuespedes = useStore((state) => state.reservasHuespedes);
  const tema = useConfigStore((state) => state.tema);
  const setPaginaActual = useStore((state) => state.setPaginaActual);
  const [modalPQRS, setModalPQRS] = useState(null);

  const obtenerReservaPorId = (reservaId) => {
    return reservasHuespedes.find(r => r.id === reservaId);
  };

  const navegarAReserva = (reservaId) => {
    // Cambiar a la página de reservas
    setPaginaActual('reservas');
    // Aquí podrías implementar un filtro o scroll para mostrar la reserva específica
  };

  const abrirModalPQRS = (pqrs) => {
    const reserva = obtenerReservaPorId(pqrs.reservaId);
    setModalPQRS({ ...pqrs, reserva });
  };

  const getEstadoColor = (estado) => {
    if (tema === 'claro') {
      switch (estado) {
        case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
        case 'En proceso': return 'bg-blue-100 text-blue-800';
        case 'Resuelto': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else {
      switch (estado) {
        case 'Pendiente': return 'bg-yellow-900 text-yellow-200';
        case 'En proceso': return 'bg-blue-900 text-blue-200';
        case 'Resuelto': return 'bg-green-900 text-green-200';
        default: return 'bg-gray-900 text-gray-200';
      }
    }
  };

  const getTipoColor = (tipo) => {
    if (tema === 'claro') {
      switch (tipo) {
        case 'Petición': return 'bg-blue-100 text-blue-800';
        case 'Queja': return 'bg-orange-100 text-orange-800';
        case 'Reclamo': return 'bg-red-100 text-red-800';
        case 'Sugerencia': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else {
      switch (tipo) {
        case 'Petición': return 'bg-blue-900 text-blue-200';
        case 'Queja': return 'bg-orange-900 text-orange-200';
        case 'Reclamo': return 'bg-red-900 text-red-200';
        case 'Sugerencia': return 'bg-purple-900 text-purple-200';
        default: return 'bg-gray-900 text-gray-200';
      }
    }
  };

  return (
    <div className={`w-full ${tema === 'claro' ? 'text-gray-900' : 'text-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">PQRS de Clientes</h2>
        <div className={`px-3 py-1 rounded text-sm ${
          tema === 'claro' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'
        }`}>
          Total: {pqrsPendientes.length} PQRS
        </div>
      </div>

      {/* Vista desktop - tabla */}
      <div className="hidden lg:block overflow-x-auto">
        <div className={`rounded-lg shadow-lg overflow-hidden ${
          tema === 'claro' ? 'bg-white' : 'bg-gray-800'
        }`}>
          <table className="w-full text-sm">
            <thead className={`${
              tema === 'claro' ? 'bg-gray-50' : 'bg-gray-700'
            }`}>
              <tr>
                <th className="px-4 py-4 text-left font-semibold">ID PQRS</th>
                <th className="px-4 py-4 text-left font-semibold">Reserva ID</th>
                <th className="px-4 py-4 text-left font-semibold">Cliente</th>
                <th className="px-4 py-4 text-left font-semibold">Tipo</th>
                <th className="px-4 py-4 text-left font-semibold">Mensaje</th>
                <th className="px-4 py-4 text-left font-semibold">Fecha</th>
                <th className="px-4 py-4 text-left font-semibold">Estado</th>
                <th className="px-4 py-4 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pqrsPendientes.map((pqrs) => {
                const reserva = obtenerReservaPorId(pqrs.reservaId);
                return (
                  <tr key={pqrs.id} className={`border-t ${
                    tema === 'claro' ? 'border-gray-200 hover:bg-gray-50' : 'border-gray-600 hover:bg-gray-700'
                  }`}>
                    <td className="px-4 py-4 font-mono text-xs">{pqrs.id}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => navegarAReserva(pqrs.reservaId)}
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        {pqrs.reservaId}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      {reserva ? reserva.nombre : 'N/A'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTipoColor(pqrs.tipo)}`}>
                        {pqrs.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <div className="text-xs truncate" title={pqrs.mensaje}>
                        {pqrs.mensaje.length > 50 ? `${pqrs.mensaje.substring(0, 50)}...` : pqrs.mensaje}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs">
                      {new Date(pqrs.fecha).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(pqrs.estado)}`}>
                        {pqrs.estado}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => abrirModalPQRS(pqrs)}
                        className={`p-2 rounded hover:scale-110 transition-transform ${
                          tema === 'claro' ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-blue-900 text-blue-400 hover:bg-blue-800'
                        }`}
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista móvil - cards */}
      <div className="lg:hidden space-y-4">
        {pqrsPendientes.map((pqrs) => {
          const reserva = obtenerReservaPorId(pqrs.reservaId);
          return (
            <div key={pqrs.id} className={`rounded-lg shadow-lg p-4 ${
              tema === 'claro' ? 'bg-white' : 'bg-gray-800'
            }`}>
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{reserva ? reserva.nombre : 'Cliente N/A'}</h3>
                  <p className={`text-sm ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {pqrs.id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTipoColor(pqrs.tipo)}`}>
                    {pqrs.tipo}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(pqrs.estado)}`}>
                    {pqrs.estado}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <p className={`text-xs font-medium ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                    RESERVA
                  </p>
                  <button
                    onClick={() => navegarAReserva(pqrs.reservaId)}
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    {pqrs.reservaId}
                  </button>
                </div>
                <div>
                  <p className={`text-xs font-medium ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                    FECHA
                  </p>
                  <p className="text-sm">
                    {new Date(pqrs.fecha).toLocaleDateString('es-CO', { 
                      day: '2-digit', 
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Mensaje */}
              <div className="mb-3">
                <p className={`text-xs font-medium ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                  MENSAJE
                </p>
                <p className="text-sm line-clamp-3">
                  {pqrs.mensaje.length > 150 ? `${pqrs.mensaje.substring(0, 150)}...` : pqrs.mensaje}
                </p>
                {pqrs.mensaje.length > 150 && (
                  <button
                    onClick={() => abrirModalPQRS(pqrs)}
                    className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                  >
                    ver más
                  </button>
                )}
              </div>

              {/* Acciones */}
              <div className="flex justify-end">
                <button
                  onClick={() => abrirModalPQRS(pqrs)}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${
                    tema === 'claro' ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-blue-900 text-blue-400 hover:bg-blue-800'
                  }`}
                >
                  <Eye size={14} />
                  Ver detalles
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal PQRS */}
      {modalPQRS && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto ${
            tema === 'claro' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Detalles de PQRS</h3>
              <button
                onClick={() => setModalPQRS(null)}
                className={`p-1 rounded hover:bg-opacity-10 ${
                  tema === 'claro' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'
                }`}
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Info PQRS */}
              <div className={`p-4 rounded border ${
                tema === 'claro' ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
              }`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className={`text-xs font-medium ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                      ID PQRS
                    </p>
                    <p className="font-mono">{modalPQRS.id}</p>
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                      FECHA
                    </p>
                    <p>{new Date(modalPQRS.fecha).toLocaleDateString('es-CO', { 
                      weekday: 'long',
                      day: '2-digit', 
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                      TIPO
                    </p>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getTipoColor(modalPQRS.tipo)}`}>
                      {modalPQRS.tipo}
                    </span>
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                      ESTADO
                    </p>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getEstadoColor(modalPQRS.estado)}`}>
                      {modalPQRS.estado}
                    </span>
                  </div>
                </div>

                <div>
                  <p className={`text-xs font-medium mb-2 ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>
                    MENSAJE
                  </p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {modalPQRS.mensaje}
                  </p>
                </div>
              </div>

              {/* Info Reserva */}
              {modalPQRS.reserva && (
                <div className={`p-4 rounded border ${
                  tema === 'claro' ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/20 border-blue-800'
                }`}>
                  <h4 className="font-medium mb-3">Información de la Reserva</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>ID:</span>
                      <button
                        onClick={() => navegarAReserva(modalPQRS.reservaId)}
                        className="ml-1 text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        {modalPQRS.reserva.id}
                      </button>
                    </div>
                    <div>
                      <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Cliente:</span>
                      <span className="ml-1 font-medium">{modalPQRS.reserva.nombre}</span>
                    </div>
                    <div>
                      <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Domo:</span>
                      <span className="ml-1 font-medium">{modalPQRS.reserva.domo}</span>
                    </div>
                    <div>
                      <span className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>Estadía:</span>
                      <span className="ml-1 font-medium">
                        {new Date(modalPQRS.reserva.fechaEntrada).toLocaleDateString('es-CO')} - {new Date(modalPQRS.reserva.fechaSalida).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setModalPQRS(null)}
                className={`px-4 py-2 rounded font-medium ${
                  tema === 'claro' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-600 text-white hover:bg-gray-500'
                }`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
