import { create } from 'zustand';

export const useStore = create((set) => ({
  notificaciones: [
    {
      id: 1,
      tipo: "PQRS",
      mensaje: "Nuevo mensaje de Juan Pérez",
      fecha: "2025-07-17 10:35 AM",
    },
    {
      id: 2,
      tipo: "Reserva",
      mensaje: "Nueva reserva para el 20 de julio",
      fecha: "2025-07-17 09:20 AM",
    },
    {
      id: 3,
      tipo: "Agente IA",
      mensaje: "Se respondió una pregunta sobre disponibilidad",
      fecha: "2025-07-16 11:45 PM",
    },
  ],
  // ...otros estados


  paginaActual: 'inicio',

  usuarios: [
    {
      id: 1,
      nombre: "Juan Pérez",
      correo: "juan@example.com",
      rol: "Administrador",
      contrasena: "admin123"
    },
    {
      id: 2,
      nombre: "Invitado",
      correo: "user@example.com",
      contrasena: "user123",
      rol: "Invitado",
    },
  ],
  

  diasReservados: [],
  pqrsPendientes: [],

  setPaginaActual: (pagina) => set({ paginaActual: pagina }),

  agregarUsuario: (nuevo) =>
    set((state) => ({
      usuarios: [...state.usuarios, { ...nuevo, id: Date.now() }],
    })),

  toggleReserva: (dia, texto) =>
    set((state) => {
      const existe = state.diasReservados.find((d) => d.dia === dia);
      return {
        diasReservados: existe
          ? state.diasReservados.filter((d) => d.dia !== dia)
          : [...state.diasReservados, { dia, tipo: texto }],
      };
    }),

  agregarPQRS: (tipo, mensaje) =>
    set((state) => ({
      pqrsPendientes: [
        ...state.pqrsPendientes,
        { id: Date.now(), tipo, mensaje },
      ],
    })),
}));
