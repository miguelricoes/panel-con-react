import { useStore } from "../store/useStore";
import { useConfigStore } from "../store/configStore";
import { useState } from "react";

export default function Calendario() {
  const diasReservados = useStore((state) => state.diasReservados);
  const agregarReservaRapida = useStore((state) => state.agregarReservaRapida);
  const eliminarReserva = useStore((state) => state.eliminarReserva);
  const tema = useConfigStore((state) => state.tema);
  const [mesActual, setMesActual] = useState(new Date().getMonth());
  const [añoActual, setAñoActual] = useState(new Date().getFullYear());
  const [modalReserva, setModalReserva] = useState(null);

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Obtener primer día del mes y cantidad de días
  const primerDiaDelMes = new Date(añoActual, mesActual, 1).getDay();
  const diasEnMes = new Date(añoActual, mesActual + 1, 0).getDate();

  const cambiarMes = (direccion) => {
    if (direccion === "anterior") {
      if (mesActual === 0) {
        setMesActual(11);
        setAñoActual(añoActual - 1);
      } else {
        setMesActual(mesActual - 1);
      }
    } else {
      if (mesActual === 11) {
        setMesActual(0);
        setAñoActual(añoActual + 1);
      } else {
        setMesActual(mesActual + 1);
      }
    }
  };

  const manejarClickDia = (dia) => {
    const fechaCompleta = `${añoActual}-${String(mesActual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const reservasDelDia = diasReservados.filter((d) => d.dia === fechaCompleta);

    if (reservasDelDia.length > 0) {
      // Mostrar modal con las reservas del día
      setModalReserva({
        fecha: fechaCompleta,
        reservas: reservasDelDia
      });
    } else {
      // Crear nueva reserva rápida
      const nombre = prompt("Nombre del huésped:");
      if (nombre) {
        const domos = ["Centary", "Polaris", "Antares", "Sirius"];
        const domo = prompt(`Domo (${domos.join(', ')}):`);
        if (domo && domos.includes(domo)) {
          agregarReservaRapida(fechaCompleta, nombre, domo);
        }
      }
    }
  };

  const obtenerReservasDelDia = (dia) => {
    const fechaCompleta = `${añoActual}-${String(mesActual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    return diasReservados.filter((d) => d.dia === fechaCompleta);
  };

  // Generar días del calendario
  const renderizarCalendario = () => {
    const dias = [];
    
    // Espacios vacíos para el primer día del mes
    for (let i = 0; i < primerDiaDelMes; i++) {
      dias.push(
        <div key={`empty-${i}`} className="p-2 h-20"></div>
      );
    }

    // Días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const reservasDelDia = obtenerReservasDelDia(dia);
      const tieneReservas = reservasDelDia.length > 0;
      const esHoy = dia === new Date().getDate() && 
                   mesActual === new Date().getMonth() && 
                   añoActual === new Date().getFullYear();

      dias.push(
        <div
          key={dia}
          onClick={() => manejarClickDia(dia)}
          className={`p-1 sm:p-2 h-16 sm:h-20 rounded cursor-pointer border text-center transition-all duration-200 flex flex-col justify-between ${
            tema === 'claro' 
              ? (tieneReservas 
                  ? 'bg-red-100 text-red-800 border-red-300' 
                  : (esHoy ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'))
              : (tieneReservas 
                  ? 'bg-red-900 text-red-200 border-red-700' 
                  : (esHoy ? 'bg-blue-900 text-blue-200 border-blue-700' : 'bg-gray-800 hover:bg-gray-700 border-gray-600'))
          }`}
          title={tieneReservas ? `${reservasDelDia.length} reserva(s)` : 'Disponible'}
        >
          <div className={`font-bold text-xs sm:text-sm ${esHoy ? 'underline' : ''}`}>
            {dia}
          </div>
          {tieneReservas && (
            <div className="text-xs truncate px-1 hidden sm:block">
              {reservasDelDia.length > 1 
                ? `${reservasDelDia.length} reservas`
                : reservasDelDia[0].tipo
              }
            </div>
          )}
          {tieneReservas && (
            <div className="flex justify-center sm:hidden">
              {reservasDelDia.length > 1 ? (
                <span className="text-xs font-bold">{reservasDelDia.length}</span>
              ) : (
                <div className="w-2 h-2 bg-current rounded-full opacity-75"></div>
              )}
            </div>
          )}
        </div>
      );
    }

    return dias;
  };

  return (
    <div className={`w-full ${tema === 'claro' ? 'text-gray-900' : 'text-white'}`}>
      {/* Header del calendario */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Calendario de Reservas</h2>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-lg md:text-xl font-semibold order-1 sm:order-2">
            {meses[mesActual]} {añoActual}
          </span>
          <div className="flex items-center gap-2 order-2 sm:order-1">
            <button
              onClick={() => cambiarMes("anterior")}
              className={`px-3 py-2 rounded text-sm ${
                tema === 'claro' 
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              ← Ant.
            </button>
            <button
              onClick={() => cambiarMes("siguiente")}
              className={`px-3 py-2 rounded text-sm ${
                tema === 'claro' 
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              Sig. →
            </button>
          </div>
        </div>
      </div>


      {/* Calendario */}
      <div className={`rounded-lg overflow-hidden shadow-lg ${
        tema === 'claro' ? 'bg-white' : 'bg-gray-800'
      }`}>
        {/* Encabezados de días de la semana */}
        <div className="grid grid-cols-7 gap-0">
          {diasSemana.map((dia) => (
            <div
              key={dia}
              className={`p-2 sm:p-3 text-center font-semibold border-b text-xs sm:text-sm ${
                tema === 'claro' 
                  ? 'bg-gray-100 text-gray-700 border-gray-200' 
                  : 'bg-gray-700 text-gray-300 border-gray-600'
              }`}
            >
              <span className="hidden sm:inline">{dia}</span>
              <span className="sm:hidden">{dia.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Días del calendario */}
        <div className="grid grid-cols-7 gap-0">
          {renderizarCalendario()}
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${tema === 'claro' ? 'bg-red-100 border border-red-300' : 'bg-red-900 border border-red-700'}`}></div>
          <span>Con reserva</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${tema === 'claro' ? 'bg-blue-100 border border-blue-300' : 'bg-blue-900 border border-blue-700'}`}></div>
          <span>Hoy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${tema === 'claro' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-800 border border-gray-600'}`}></div>
          <span>Disponible</span>
        </div>
      </div>

      {/* Modal de reservas del día */}
      {modalReserva && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto ${
            tema === 'claro' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                Reservas - {new Date(modalReserva.fecha).toLocaleDateString('es-CO', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <button
                onClick={() => setModalReserva(null)}
                className={`p-1 rounded hover:bg-opacity-10 ${
                  tema === 'claro' ? 'hover:bg-gray-200' : 'hover:bg-gray-600'
                }`}
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {modalReserva.reservas.map((reserva, index) => (
                <div key={index} className={`p-4 rounded border ${
                  tema === 'claro' ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold">{reserva.huesped.nombre}</h4>
                      <p className="text-sm text-blue-600">{reserva.huesped.id}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      reserva.huesped.domo === 'Centary' ? (tema === 'claro' ? 'bg-purple-100 text-purple-800' : 'bg-purple-900 text-purple-200') :
                      reserva.huesped.domo === 'Polaris' ? (tema === 'claro' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-200') :
                      reserva.huesped.domo === 'Antares' ? (tema === 'claro' ? 'bg-orange-100 text-orange-800' : 'bg-orange-900 text-orange-200') :
                      (tema === 'claro' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200')
                    }`}>
                      {reserva.huesped.domo}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
                        Huéspedes: <span className="font-medium">{reserva.huesped.numeroPersonas}</span>
                      </p>
                    </div>
                    <div>
                      <p className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
                        Contacto: <span className="font-medium">{reserva.huesped.numero}</span>
                      </p>
                    </div>
                    <div>
                      <p className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
                        Check-in: <span className="font-medium">
                          {new Date(reserva.huesped.fechaEntrada).toLocaleDateString('es-CO')}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className={`${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
                        Check-out: <span className="font-medium">
                          {new Date(reserva.huesped.fechaSalida).toLocaleDateString('es-CO')}
                        </span>
                      </p>
                    </div>
                  </div>

                  {reserva.huesped.observaciones && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className={`text-xs ${tema === 'claro' ? 'text-gray-600' : 'text-gray-400'}`}>
                        <strong>Observaciones:</strong> {reserva.huesped.observaciones}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar la reserva de ${reserva.huesped.nombre}?`)) {
                          eliminarReserva(reserva.huesped.id);
                          setModalReserva(null);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar reserva
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setModalReserva(null)}
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