import { create } from 'zustand';
import { fetchReservas, syncReservas } from '../api/reservasApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://agente-glamping-production.up.railway.app';

export const useStore = create((set, get) => ({
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

  // === ESTADO DE USUARIOS ===
  usuarios: [],
  loadingUsuarios: false,
  

  // diasReservados se calcula como función para evitar problemas con 'this'
  diasReservados: [],

  // Función para calcular días reservados
  calcularDiasReservados: () => {
    const state = useStore.getState();
    const dias = [];
    
    try {
      state.reservasHuespedes.forEach(reserva => {
        const fechaInicio = new Date(reserva.fechaEntrada);
        const fechaFin = new Date(reserva.fechaSalida);
        
        // Evitar loop infinito con contador de seguridad
        let contador = 0;
        const maxDias = 365; // Límite de seguridad
        
        for (let fecha = new Date(fechaInicio); fecha < fechaFin && contador < maxDias; contador++) {
          const fechaStr = fecha.toISOString().split('T')[0];
          dias.push({
            dia: fechaStr,
            tipo: `${reserva.domo} - ${reserva.nombre}`,
            huesped: reserva
          });
          fecha.setDate(fecha.getDate() + 1);
        }
      });
    } catch (error) {
      console.error('Error calculando días reservados:', error);
    }
    
    return dias;
  },

  // Función para actualizar días reservados
  actualizarDiasReservados: () => set((state) => ({
    diasReservados: state.calcularDiasReservados()
  })),
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

  // Array de reservas - se carga desde la API
  reservasHuespedes: [],

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

  // Estados para la sincronización con la API
  isLoading: false,
  lastSync: null,
  syncError: null,

  // Función principal para cargar reservas (versión simplificada)
  cargarReservas: async () => {
    set({ isLoading: true, syncError: null });

    try {
      console.log('🚀 Store: Cargando reservas desde API...');

      const data = await fetchReservas(); // Función de reservasApi.js

      if (data && data.reservas) {
        set({
          reservasHuespedes: data.reservas,
          isLoading: false,
          lastSync: new Date().toISOString(),
          syncError: null
        });

        console.log(`✅ Store: ${data.reservas.length} reservas cargadas`);
        
        // Actualizar días reservados después de cargar las reservas
        const state = get();
        state.actualizarDiasReservados();
      } else {
        throw new Error('No se recibieron datos válidos');
      }

    } catch (error) {
      console.error('❌ Store: Error cargando reservas:', error);
      set({
        isLoading: false,
        syncError: error.message,
        reservasHuespedes: [] // Fallback a array vacío
      });
    }
  },

  // Función extendida para cargar reservas desde la API (mantener para retrocompatibilidad)
  cargarReservasDesdeAPI: async () => {
    const state = get();
    await state.cargarReservas();
  },

  // Función para sincronizar periódicamente
  sincronizarReservas: async () => {
    try {
      const reservasAPI = await syncReservas();
      if (reservasAPI) {
        set({ 
          reservasHuespedes: reservasAPI,
          lastSync: new Date().toISOString(),
          syncError: null
        });
        // Actualizar días reservados después de sincronizar
        const state = get();
        state.actualizarDiasReservados();
      }
    } catch (error) {
      console.error('Error sincronizando reservas:', error);
      set({ syncError: error.message });
    }
  },

  // Función para forzar una sincronización
  forzarSincronizacion: async () => {
    const state = get();
    await state.cargarReservas();
  },

  // === ACCIONES DE USUARIOS ===
  fetchUsuarios: async (includePasswords = false) => {
    set({ loadingUsuarios: true });
    try {
      const url = includePasswords
        ? `${API_BASE_URL}/api/usuarios?include_passwords=true`
        : `${API_BASE_URL}/api/usuarios`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });

      if (response.ok) {
        const data = await response.json();
        const allUsers = Array.isArray(data) ? data : (data.usuarios || data.data || []);
        const usuarios = allUsers.filter(user => user.activo === true);
        set({ usuarios, loadingUsuarios: false });
        console.log(`✅ ${usuarios.length} usuarios cargados desde backend`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error HTTP cargando usuarios:', response.status, errorData);
        set({ loadingUsuarios: false });
      }
    } catch (error) {
      console.error('❌ Error de conexión cargando usuarios:', error);
      set({ loadingUsuarios: false });
    }
  },

  createUsuario: async (userData) => {
    try {
      console.log('🚀 Creando usuario:', userData);
      const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Usuario creado exitosamente:', result);
        get().fetchUsuarios(); // Recargar lista
        return { success: true, data: result };
      }
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error creando usuario:', response.status, errorData);
      return { success: false, error: errorData.error || errorData.message || 'Error creando usuario' };
    } catch (error) {
      console.error('❌ Error de conexión creando usuario:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  },

  updateUsuario: async (userId, userData) => {
    try {
      console.log('🚀 Actualizando usuario:', userId, userData);
      const response = await fetch(`${API_BASE_URL}/api/usuarios/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Usuario actualizado exitosamente:', result);
        get().fetchUsuarios(); // Recargar lista
        return { success: true, data: result };
      }
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error actualizando usuario:', response.status, errorData);
      return { success: false, error: errorData.error || errorData.message || 'Error actualizando usuario' };
    } catch (error) {
      console.error('❌ Error de conexión actualizando usuario:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  },

  deleteUsuario: async (userId) => {
    try {
      console.log('🚀 Eliminando usuario:', userId);
      const response = await fetch(`${API_BASE_URL}/api/usuarios/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });

      if (response.ok) {
        const result = await response.json().catch(() => ({ message: 'Usuario eliminado' }));
        console.log('✅ Usuario eliminado exitosamente:', result);
        get().fetchUsuarios(); // Recargar lista
        return { success: true, data: result };
      }
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error eliminando usuario:', response.status, errorData);
      return { success: false, error: errorData.error || errorData.message || 'Error eliminando usuario' };
    } catch (error) {
      console.error('❌ Error de conexión eliminando usuario:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  },

  regeneratePassword: async (userId) => {
    try {
      console.log('🚀 Regenerando contraseña para usuario:', userId);
      const response = await fetch(`${API_BASE_URL}/api/usuarios/${userId}/regenerate-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Contraseña regenerada:', result);
        // Recargar usuarios con contraseñas
        get().fetchUsuarios(true);
        return { success: true, password: result.temp_password };
      }
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.error || 'Error regenerando contraseña' };
    } catch (error) {
      console.error('❌ Error regenerando contraseña:', error);
      return { success: false, error: 'Error de conexión' };
    }
  },
}));
