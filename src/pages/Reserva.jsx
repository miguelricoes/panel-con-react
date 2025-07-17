import { useStore } from "@/store/useStore";

export default function Reserva() {
  const diasReservados = useStore((state) => state.diasReservados);
  const toggleReserva = useStore((state) => state.toggleReserva);

  const manejarClickDia = (dia) => {
    const yaReservado = diasReservados.find((d) => d.dia === dia);

    if (yaReservado) {
      // Desmarcar si ya está reservado
      toggleReserva(dia);
    } else {
      const texto = prompt("¿Qué hay reservado para este día?");
      if (texto) {
        toggleReserva(dia, texto);
      }
    }
  };

  return (
    <div className="text-white w-full">
      <h2 className="text-xl font-bold mb-2">Calendario de Reservas</h2>
      <p className="text-sm mb-4">Haz clic en un día para marcarlo o desmarcarlo como reservado.</p>

      <div className="grid grid-cols-7 gap-2 mt-4">
        {Array.from({ length: 30 }, (_, i) => {
          const dia = i + 1;
          const reserva = diasReservados.find((d) => d.dia === dia);

          return (
            <div
              key={dia}
              onClick={() => manejarClickDia(dia)}
              className={`p-2 rounded cursor-pointer border text-center transition-all duration-200 ${
                reserva
                  ? 'bg-red-200 text-red-800 line-through'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              title={reserva ? reserva.tipo : 'Disponible'}
            >
              <div className="font-bold">{dia}</div>
              {reserva && (
                <div className="text-xs mt-1 truncate">{reserva.tipo}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
