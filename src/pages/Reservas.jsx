import { useState } from "react";
import { useStore } from "../store/useStore";
import { useConfigStore } from "../store/configStore";
import { Eye, Mail, X, FileText } from "lucide-react";

export default function Reservas() {
  const reservasHuespedes = useStore((state) => state.reservasHuespedes);
  const tema = useConfigStore((state) => state.tema);
  const [modalServicios, setModalServicios] = useState(null);
  const [modalCorreo, setModalCorreo] = useState(null);
  const [modalObservaciones, setModalObservaciones] = useState(null);
  const [asuntoCorreo, setAsuntoCorreo] = useState("");
  const [mensajeCorreo, setMensajeCorreo] = useState("");

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

  return (
    <div className={`w-full ${tema === 'claro' ? 'text-gray-900' : 'text-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Base de Datos - Huéspedes</h2>
        <div className={`px-3 py-1 rounded text-sm ${
          tema === 'claro' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'
        }`}>
          Total: {reservasHuespedes.length} reservas
        </div>
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
              {reservasHuespedes.map((huesped) => (
                <tr key={huesped.id} className={`border-t ${
                  tema === 'claro' ? 'border-gray-200 hover:bg-gray-50' : 'border-gray-600 hover:bg-gray-700'
                }`}>
                  <td className="px-2 py-4 font-mono text-xs">{huesped.id}</td>
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
                    {huesped.servicios.length === 0 ? (
                      <span className={`${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>N/A</span>
                    ) : (
                      <button
                        onClick={() => abrirModalServicios(huesped.servicios)}
                        className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                      >
                        <Eye size={14} />
                        ver más
                      </button>
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
        {reservasHuespedes.map((huesped) => (
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
              <div className="flex gap-2">
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
                {huesped.servicios.length === 0 ? (
                  <span className={`text-sm ${tema === 'claro' ? 'text-gray-500' : 'text-gray-400'}`}>N/A</span>
                ) : (
                  <button
                    onClick={() => abrirModalServicios(huesped.servicios)}
                    className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1 text-sm"
                  >
                    <Eye size={14} />
                    {huesped.servicios.length} servicios
                  </button>
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
                <div key={index} className={`p-3 rounded border ${
                  tema === 'claro' ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
                }`}>
                  <div className="font-medium">{servicio.nombre}</div>
                  <div className={`text-sm ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
                    Precio: ${servicio.precio.toLocaleString()}
                  </div>
                  {servicio.descripcion && (
                    <div className={`text-sm mt-1 ${tema === 'claro' ? 'text-gray-500' : 'text-gray-300'}`}>
                      {servicio.descripcion}
                    </div>
                  )}
                </div>
              ))}
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