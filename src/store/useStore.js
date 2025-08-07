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
  

  // diasReservados se genera automáticamente desde reservasHuespedes
  get diasReservados() {
    const dias = [];
    this.reservasHuespedes.forEach(reserva => {
      const fechaInicio = new Date(reserva.fechaEntrada);
      const fechaFin = new Date(reserva.fechaSalida);
      
      // Generar todos los días entre entrada y salida (incluyendo entrada, excluyendo salida)
      for (let fecha = new Date(fechaInicio); fecha < fechaFin; fecha.setDate(fecha.getDate() + 1)) {
        const fechaStr = fecha.toISOString().split('T')[0];
        dias.push({
          dia: fechaStr,
          tipo: `${reserva.domo} - ${reserva.nombre}`,
          huesped: reserva
        });
      }
    });
    return dias;
  },
  pqrsPendientes: [
    {
      id: "PQRS-001",
      reservaId: "RSV-002",
      tipo: "Sugerencia",
      mensaje: "El lugar es hermoso y la atención excelente. Como sugerencia, sería bueno tener más opciones vegetarianas en el menú del desayuno. También sugiero instalar luces LED en los senderos para mayor seguridad durante la noche.",
      fecha: "2025-06-25",
      estado: "Resuelto"
    },
    {
      id: "PQRS-002", 
      reservaId: "RSV-001",
      tipo: "Queja",
      mensaje: "Aunque el servicio fue muy bueno en general, tuvimos algunos problemas con la rampa de acceso al domo que estaba un poco resbalosa después de la lluvia. También la puerta del baño era un poco estrecha para la silla de ruedas.",
      fecha: "2025-07-18",
      estado: "En proceso"
    },
    {
      id: "PQRS-003",
      reservaId: "RSV-004", 
      tipo: "Petición",
      mensaje: "Nos encantó la experiencia! Quisiéramos solicitar si es posible reservar el mismo domo (Sirius) para nuestra próxima visita en diciembre. También nos gustaría saber si tienen descuentos para huéspedes que regresan.",
      fecha: "2025-04-05",
      estado: "Resuelto"
    },
    {
      id: "PQRS-004",
      reservaId: "RSV-003",
      tipo: "Reclamo", 
      mensaje: "El servicio fue bueno pero hubo un problema con la seguridad infantil. Los protectores de escaleras no estaban instalados al llegar y tuvimos que solicitarlos. Uno de los niños se lastimó levemente. Esperamos que esto se mejore para futuras familias.",
      fecha: "2025-05-30",
      estado: "Resuelto"
    },
    {
      id: "PQRS-005",
      reservaId: "RSV-005",
      tipo: "Sugerencia",
      mensaje: "Nuestra estadía fue perfecta. Como sugerencia, sería genial tener un servicio de desayuno más temprano para quienes madrugamos. También sería útil tener más información sobre las actividades cercanas.",
      fecha: "2025-08-15",
      estado: "Pendiente"
    },
    {
      id: "PQRS-006",
      reservaId: "RSV-006",
      tipo: "Queja",
      mensaje: "La experiencia fue buena en general, pero hubo ruido excesivo de otros huéspedes durante la noche. Sugiero implementar políticas más claras de ruido después de las 10 PM.",
      fecha: "2025-08-13",
      estado: "Pendiente"
    }
  ],

  reservasHuespedes: [
    {
      id: "RSV-001",
      nombre: "María González Pérez",
      numero: "+57 300 123 4567",
      email: "maria.gonzalez@email.com",
      numeroPersonas: 4,
      fechaEntrada: "2025-07-15",
      fechaSalida: "2025-07-17",
      domo: "Centary",
      servicios: [
        { nombre: "Cena romántica", precio: 80000, descripcion: "Cena para dos personas con vista al lago" },
        { nombre: "Spa y relajación", precio: 120000, descripcion: "Masajes y tratamientos de spa" }
      ],
      montoAPagar: 450000,
      metodoPago: "Transferencia",
      observaciones: "Huésped con movilidad reducida. Requiere acceso especial al domo y rampa de acceso. La señora María utiliza silla de ruedas y necesita que el domo esté preparado con barras de apoyo en el baño. También solicita que el estacionamiento esté lo más cerca posible de la entrada. Es importante tener en cuenta que viajan con un perro de asistencia certificado."
    },
    {
      id: "RSV-002", 
      nombre: "Carlos Rodríguez",
      numero: "+57 310 987 6543",
      email: "carlos.rodriguez@email.com",
      numeroPersonas: 2,
      fechaEntrada: "2025-06-20",
      fechaSalida: "2025-06-22",
      domo: "Polaris",
      servicios: [],
      montoAPagar: 280000,
      metodoPago: "Efectivo",
      observaciones: "Aniversario de bodas. Solicita decoración especial."
    },
    {
      id: "RSV-003",
      nombre: "Ana Sofía Martínez",
      numero: "+57 320 456 7890",
      email: "anasofia.martinez@email.com",
      numeroPersonas: 6,
      fechaEntrada: "2025-05-25",
      fechaSalida: "2025-05-28",
      domo: "Antares",
      servicios: [
        { nombre: "Fogata nocturna", precio: 50000, descripcion: "Fogata con malvaviscos y música" },
        { nombre: "Desayuno especial", precio: 35000, descripcion: "Desayuno gourmet en el domo" },
        { nombre: "Tour de observación", precio: 60000, descripcion: "Tour guiado para observar estrellas" }
      ],
      montoAPagar: 520000,
      metodoPago: "Tarjeta",
      observaciones: "Grupo familiar con niños pequeños de 2, 4 y 6 años. Requiere cunas adicionales y medidas de seguridad infantil. Los padres solicitan que se instalen protectores en las escaleras y balcones. También necesitan un área segura para que los niños jueguen. La familia es vegetariana estricta y requiere menús especiales. Uno de los niños tiene alergia al maní, por favor tener especial cuidado con los alimentos que se sirvan."
    },
    {
      id: "RSV-004",
      nombre: "Luis Fernando Castro",
      numero: "+57 315 234 5678",
      email: "luis.castro@email.com", 
      numeroPersonas: 3,
      fechaEntrada: "2025-04-01",
      fechaSalida: "2025-04-03",
      domo: "Sirius",
      servicios: [
        { nombre: "Transporte especial", precio: 45000, descripcion: "Transporte desde la ciudad" }
      ],
      montoAPagar: 375000,
      metodoPago: "Transferencia",
      observaciones: "Primera vez en glamping. Muy entusiasmados."
    },
    {
      id: "RSV-005",
      nombre: "Isabella Jiménez Ramos",
      numero: "+57 301 876 5432",
      email: "isabella.jimenez@email.com",
      numeroPersonas: 2,
      fechaEntrada: "2025-08-12",
      fechaSalida: "2025-08-14",
      domo: "Polaris",
      servicios: [],
      montoAPagar: 280000,
      metodoPago: "Efectivo",
      observaciones: ""
    },
    {
      id: "RSV-006",
      nombre: "Roberto Castillo Vega",
      numero: "+57 311 555 7788",
      email: "roberto.castillo@email.com",
      numeroPersonas: 5,
      fechaEntrada: "2025-08-10",
      fechaSalida: "2025-08-12",
      domo: "Centary",
      servicios: [
        { nombre: "Cena romántica", precio: 80000, descripcion: "Cena para dos personas con vista al lago" }
      ],
      montoAPagar: 420000,
      metodoPago: "Tarjeta",
      observaciones: "Celebración familiar de cumpleaños. Solicitan torta especial."
    },
    {
      id: "RSV-007",
      nombre: "Sofía Hernández Torres",
      numero: "+57 312 444 9900",
      email: "sofia.hernandez@email.com",
      numeroPersonas: 2,
      fechaEntrada: "2025-08-15",
      fechaSalida: "2025-08-17",
      domo: "Sirius",
      servicios: [],
      montoAPagar: 280000,
      metodoPago: "Transferencia",
      observaciones: "Luna de miel. Primera vez en glamping."
    },
    {
      id: "RSV-008",
      nombre: "Alejandro Ruiz Moreno",
      numero: "+57 313 777 2233",
      email: "alejandro.ruiz@email.com",
      numeroPersonas: 4,
      fechaEntrada: "2025-08-22",
      fechaSalida: "2025-08-25",
      domo: "Antares",
      servicios: [
        { nombre: "Tour de observación", precio: 60000, descripcion: "Tour guiado para observar estrellas" }
      ],
      montoAPagar: 460000,
      metodoPago: "Efectivo",
      observaciones: "Viaje con amigos. Interesados en actividades nocturnas."
    }
  ],

  setPaginaActual: (pagina) => set({ paginaActual: pagina }),

  agregarUsuario: (nuevo) =>
    set((state) => ({
      usuarios: [...state.usuarios, { ...nuevo, id: Date.now() }],
    })),

  // Función para agregar/quitar reservas rápidas (solo para demo/testing)
  agregarReservaRapida: (fecha, nombre, domo) =>
    set((state) => {
      const nuevaReserva = {
        id: `RSV-${String(state.reservasHuespedes.length + 1).padStart(3, '0')}`,
        nombre: nombre,
        numero: "+57 000 000 0000",
        email: "temp@email.com",
        numeroPersonas: 2,
        fechaEntrada: fecha,
        fechaSalida: new Date(new Date(fecha).getTime() + 86400000).toISOString().split('T')[0], // +1 día
        domo: domo,
        servicios: [],
        montoAPagar: 280000,
        metodoPago: "Efectivo",
        observaciones: "Reserva creada desde el calendario"
      };
      
      return {
        reservasHuespedes: [...state.reservasHuespedes, nuevaReserva]
      };
    }),

  eliminarReserva: (reservaId) =>
    set((state) => ({
      reservasHuespedes: state.reservasHuespedes.filter(r => r.id !== reservaId)
    })),

  agregarPQRS: (tipo, mensaje) =>
    set((state) => ({
      pqrsPendientes: [
        ...state.pqrsPendientes,
        { id: Date.now(), tipo, mensaje },
      ],
    })),
}));
