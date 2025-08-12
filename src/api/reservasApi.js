const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://agente-glamping-production.up.railway.app';

// Import mock API para testing
import { mockFetchReservas } from './mockApi';

// Flag para habilitar modo mock durante desarrollo/testing
const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK === 'true' || false;

// Función para obtener todas las reservas
export const fetchReservas = async () => {
  // Si está habilitado el modo mock, usar datos simulados
  if (ENABLE_MOCK) {
    console.log('🔧 Modo MOCK habilitado - usando datos simulados');
    return await mockFetchReservas(false, 500);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/reservas`, {
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
    console.error('Error fetching reservas:', error);
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

export default {
  fetchReservas,
  createReserva,
  updateReserva,
  deleteReserva,
  fetchReservaById,
  syncReservas,
  checkApiHealth
};