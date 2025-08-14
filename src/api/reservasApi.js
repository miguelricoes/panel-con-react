const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://agente-glamping-production.up.railway.app';

// Import mock API para testing
import { mockFetchReservas } from './mockApi';

// Flag para habilitar modo mock - CAMBIAR A false PARA PRODUCCIÓN
const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK === 'true' || false;

console.log('🔧 Configuración API:', {
  API_BASE_URL,
  ENABLE_MOCK,
  env: import.meta.env.VITE_ENABLE_MOCK
});

// Cache simple para reservas
let reservasCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 30000; // 30 segundos

// Función con cache
export const fetchReservasWithCache = async (forceRefresh = false) => {
  const now = Date.now();

  if (!forceRefresh && reservasCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
    console.log('📦 Usando datos del cache');
    return reservasCache;
  }

  console.log('🔄 Cache expirado o forzando refresh - obteniendo datos frescos');
  const data = await fetchReservas();
  reservasCache = data;
  cacheTimestamp = now;
  console.log(`✅ Cache actualizado - válido por ${CACHE_DURATION / 1000} segundos`);

  return data;
};

// Función para limpiar cache
export const clearReservasCache = () => {
  console.log('🗑️ Limpiando cache de reservas');
  reservasCache = null;
  cacheTimestamp = null;
};

// Función para obtener todas las reservas
export const fetchReservas = async () => {
  // Si está habilitado el modo mock, usar datos simulados
  if (ENABLE_MOCK) {
    console.log('🔧 Modo MOCK habilitado - usando datos simulados');
    return await mockFetchReservas(false, 500);
  }

  try {
    console.log(`🚀 Fetching reservas desde: ${API_BASE_URL}/api/reservas`);

    const response = await fetch(`${API_BASE_URL}/api/reservas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors'  // Importante para CORS
    });

    console.log(`📡 Respuesta recibida:`, response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Datos recibidos:`, data);

    // Adaptamos y validamos la respuesta para que sea compatible con el frontend
    if (data.reservas && Array.isArray(data.reservas)) {
      // Validar y transformar cada reserva con prioridad en campos importantes
      const reservasValidadas = data.reservas.map(reserva => {
        // ASEGURAR CAMPOS IMPORTANTES
        const reservaValidada = {
          ...reserva,
          // CAMPOS IMPORTANTES - Con valores por defecto estrictos
          numero: reserva.numero || reserva.telefono || 'REQUERIDO',
          email: reserva.email || reserva.email_contacto || 'REQUERIDO',
          numeroPersonas: parseInt(reserva.numeroPersonas || reserva.cantidad_huespedes) || 1,
          domo: reserva.domo || 'REQUERIDO',
          fechaEntrada: reserva.fechaEntrada || reserva.fecha_entrada || null,
          fechaSalida: reserva.fechaSalida || reserva.fecha_salida || null,
          metodoPago: reserva.metodoPago || reserva.metodo_pago || 'REQUERIDO',

          // CAMPOS OPCIONALES - Pueden estar vacíos sin problema
          servicios: Array.isArray(reserva.servicios) ? reserva.servicios : [],
          adicciones: reserva.adicciones || '',
          observaciones: reserva.observaciones || reserva.comentarios_especiales || '',
          nombre: reserva.nombre || reserva.nombres_huespedes || `Usuario ${reserva.numero}`,

          // METADATOS
          montoAPagar: typeof reserva.montoAPagar === 'number' ? reserva.montoAPagar : parseFloat(reserva.monto_total) || 0
        };

        // Agregar indicadores de completitud
        const validacion = validarReserva(reservaValidada);
        reservaValidada._validacion = {
          esValida: validacion.esValida,
          esCompleta: validacion.esCompleta,
          camposImportantesFaltantes: validacion.camposImportantesFaltantes.length,
          camposOpcionalesFaltantes: validacion.camposOpcionalesFaltantes.length
        };

        return reservaValidada;
      });

      console.log(`✅ ${reservasValidadas.length} reservas validadas y transformadas`);

      return {
        reservas: reservasValidadas,
        total: data.count || data.total || reservasValidadas.length,
        status: 'success'
      };
    } else if (Array.isArray(data)) {
      // En caso de que solo venga el array de reservas
      const reservasValidadas = data.map(reserva => {
        // ASEGURAR CAMPOS IMPORTANTES
        const reservaValidada = {
          ...reserva,
          // CAMPOS IMPORTANTES - Con valores por defecto estrictos
          numero: reserva.numero || reserva.telefono || 'REQUERIDO',
          email: reserva.email || reserva.email_contacto || 'REQUERIDO',
          numeroPersonas: parseInt(reserva.numeroPersonas || reserva.cantidad_huespedes) || 1,
          domo: reserva.domo || 'REQUERIDO',
          fechaEntrada: reserva.fechaEntrada || reserva.fecha_entrada || null,
          fechaSalida: reserva.fechaSalida || reserva.fecha_salida || null,
          metodoPago: reserva.metodoPago || reserva.metodo_pago || 'REQUERIDO',

          // CAMPOS OPCIONALES - Pueden estar vacíos sin problema
          servicios: Array.isArray(reserva.servicios) ? reserva.servicios : [],
          adicciones: reserva.adicciones || '',
          observaciones: reserva.observaciones || reserva.comentarios_especiales || '',
          nombre: reserva.nombre || reserva.nombres_huespedes || `Usuario ${reserva.numero}`,

          // METADATOS
          montoAPagar: typeof reserva.montoAPagar === 'number' ? reserva.montoAPagar : parseFloat(reserva.monto_total) || 0
        };

        // Agregar indicadores de completitud
        const validacion = validarReserva(reservaValidada);
        reservaValidada._validacion = {
          esValida: validacion.esValida,
          esCompleta: validacion.esCompleta,
          camposImportantesFaltantes: validacion.camposImportantesFaltantes.length,
          camposOpcionalesFaltantes: validacion.camposOpcionalesFaltantes.length
        };

        return reservaValidada;
      });

      console.log(`✅ ${reservasValidadas.length} reservas validadas y transformadas (formato directo)`);

      return {
        reservas: reservasValidadas,
        total: reservasValidadas.length,
        status: 'success'
      };
    } else {
      throw new Error('Formato de datos inválido recibido del servidor');
    }

  } catch (error) {
    console.error('❌ Error fetching reservas:', error);

    // Log detallado para debugging
    console.error('Detalles del error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    throw error;
  }
};

// Función para crear una nueva reserva
export const createReserva = async (reservaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservaData),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating reserva:', error);
    throw error;
  }
};

// Función para actualizar una reserva existente
export const updateReserva = async (reservaId, reservaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reservas/${reservaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservaData),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating reserva:', error);
    throw error;
  }
};

// Función para eliminar una reserva
export const deleteReserva = async (reservaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reservas/${reservaId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting reserva:', error);
    throw error;
  }
};

// Función para obtener una reserva específica por ID
export const fetchReservaById = async (reservaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reservas/${reservaId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching reserva by ID:', error);
    throw error;
  }
};

// Función para sincronizar reservas (polling)
export const syncReservas = async () => {
  try {
    const reservas = await fetchReservas();
    return reservas;
  } catch (error) {
    console.error('Error syncing reservas:', error);
    return null;
  }
};

// Función para habilitar/deshabilitar modo mock en runtime
export const toggleMockMode = (enable) => {
  if (enable) {
    console.log('🔧 Modo MOCK habilitado');
    window.localStorage.setItem('GLAMPING_MOCK_MODE', 'true');
  } else {
    console.log('🔗 Modo REAL API habilitado');
    window.localStorage.setItem('GLAMPING_MOCK_MODE', 'false');
  }
  window.location.reload();
};

// Función para verificar conexión con el API
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

// Función para validar estructura de reserva con campos importantes vs opcionales
export const validarReserva = (reserva) => {
  // CAMPOS IMPORTANTES (obligatorios)
  const camposImportantes = {
    'numero': 'Teléfono',
    'email': 'Email',
    'numeroPersonas': 'Número de personas',
    'domo': 'Domo',
    'fechaEntrada': 'Fecha de entrada',
    'fechaSalida': 'Fecha de salida',
    'metodoPago': 'Método de pago'
  };

  // CAMPOS OPCIONALES (pueden estar vacíos)
  const camposOpcionales = ['adicciones', 'servicios', 'observaciones', 'nombre'];

  const errores = [];
  const advertencias = [];

  // Verificar CAMPOS IMPORTANTES
  Object.entries(camposImportantes).forEach(([campo, nombreAmigable]) => {
    if (!reserva[campo] ||
        reserva[campo] === 'No especificado' ||
        reserva[campo] === 'No proporcionado' ||
        reserva[campo] === 'Pendiente') {
      errores.push(`Campo importante faltante: ${nombreAmigable}`);
    }
  });

  // Validaciones específicas para campos importantes
  if (reserva.numeroPersonas && (reserva.numeroPersonas < 1 || reserva.numeroPersonas > 10)) {
    errores.push('Número de personas debe estar entre 1 y 10');
  }

  if (reserva.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reserva.email)) {
    errores.push('Email no tiene formato válido');
  }

  if (reserva.domo) {
    const domosValidos = ['antares', 'polaris', 'sirius', 'centaury'];
    if (!domosValidos.includes(reserva.domo.toLowerCase())) {
      errores.push('Domo no válido');
    }
  }

  // Verificar CAMPOS OPCIONALES (solo advertencias)
  if (!reserva.nombre || reserva.nombre === 'No especificado') {
    advertencias.push('Nombre del huésped no especificado');
  }

  if (!reserva.servicios || reserva.servicios.length === 0) {
    advertencias.push('Sin servicios adicionales');
  }

  if (!reserva.adicciones) {
    advertencias.push('Sin adiciones especificadas');
  }

  if (!reserva.observaciones) {
    advertencias.push('Sin comentarios adicionales');
  }

  // Verificar tipos de datos
  if (reserva.servicios && !Array.isArray(reserva.servicios)) {
    errores.push('El campo servicios debe ser un array');
  }

  if (reserva.montoAPagar && typeof reserva.montoAPagar !== 'number') {
    errores.push('El campo montoAPagar debe ser un número');
  }

  return {
    esValida: errores.length === 0,
    esCompleta: errores.length === 0 && advertencias.length === 0,
    errores: errores,
    advertencias: advertencias,
    camposImportantesFaltantes: errores.filter(e => e.includes('Campo importante')),
    camposOpcionalesFaltantes: advertencias
  };
};

// Función para consultar disponibilidades (para testing desde el panel)
export const fetchDisponibilidades = async (fechaInicio, fechaFin, domo, personas) => {
  try {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fecha_inicio', fechaInicio);
    if (fechaFin) params.append('fecha_fin', fechaFin);
    if (domo) params.append('domo', domo);
    if (personas) params.append('personas', personas.toString());

    const response = await fetch(`${API_BASE_URL}/api/disponibilidades?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📅 Disponibilidades recibidas:', data);

    return data;
  } catch (error) {
    console.error('❌ Error consultando disponibilidades:', error);
    throw error;
  }
};

// Función para simular consulta del agente (para testing)
export const consultarDisponibilidadesAgente = async (consulta) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agente/disponibilidades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({ consulta })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('🤖 Respuesta del agente:', data);

    return data;
  } catch (error) {
    console.error('❌ Error en consulta del agente:', error);
    throw error;
  }
};

export default {
  fetchReservas,
  fetchReservasWithCache,
  clearReservasCache,
  createReserva,
  updateReserva,
  deleteReserva,
  fetchReservaById,
  syncReservas,
  checkApiHealth,
  validarReserva,
  fetchDisponibilidades,
  consultarDisponibilidadesAgente
};