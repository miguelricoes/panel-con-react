// Utilidades para validación y testing del store
import { useStore } from '../store/useStore';

export const validateStoreStructure = () => {
  const store = useStore.getState();
  
  const validations = {
    hasReservasArray: Array.isArray(store.reservasHuespedes),
    hasLoadingState: typeof store.isLoading === 'boolean',
    hasLastSync: store.lastSync === null || typeof store.lastSync === 'string',
    hasSyncError: store.syncError === null || typeof store.syncError === 'string',
    hasCargarReservas: typeof store.cargarReservas === 'function',
    hasSincronizarReservas: typeof store.sincronizarReservas === 'function',
    hasForzarSincronizacion: typeof store.forzarSincronizacion === 'function'
  };

  const allValid = Object.values(validations).every(Boolean);
  
  return {
    valid: allValid,
    details: validations,
    store: {
      reservasCount: store.reservasHuespedes.length,
      isLoading: store.isLoading,
      lastSync: store.lastSync,
      syncError: store.syncError
    }
  };
};

export const testStoreInitialization = () => {
  const store = useStore.getState();
  
  const tests = [
    {
      name: 'Reservas inicializadas como array vacío',
      test: Array.isArray(store.reservasHuespedes) && store.reservasHuespedes.length === 0,
      actual: `Array(${store.reservasHuespedes.length})`,
      expected: 'Array(0)'
    },
    {
      name: 'Estado isLoading inicializado',
      test: typeof store.isLoading === 'boolean',
      actual: typeof store.isLoading,
      expected: 'boolean'
    },
    {
      name: 'lastSync inicializado como null',
      test: store.lastSync === null,
      actual: store.lastSync,
      expected: 'null'
    },
    {
      name: 'syncError inicializado como null',
      test: store.syncError === null,
      actual: store.syncError,
      expected: 'null'
    }
  ];

  return tests;
};

export const logStoreStatus = () => {
  const validation = validateStoreStructure();
  
  console.group('🔍 Store Validation Results');
  console.log('✅ Store Structure Valid:', validation.valid);
  console.log('📊 Store Details:', validation.details);
  console.log('📋 Current State:', validation.store);
  console.groupEnd();
  
  return validation;
};

export const simulateApiCall = async (shouldFail = false) => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  await delay(500); // Simular latencia de red
  
  if (shouldFail) {
    throw new Error('API call failed - simulación de error');
  }
  
  return [
    {
      id: "SIM-001",
      nombre: "Usuario Simulado",
      numero: "+57 300 000 0000",
      email: "simulado@test.com",
      numeroPersonas: 2,
      fechaEntrada: new Date().toISOString().split('T')[0],
      fechaSalida: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      domo: "Test Domo",
      servicios: [],
      montoAPagar: 250000,
      metodoPago: "Efectivo",
      observaciones: "Reserva de prueba simulada"
    }
  ];
};

// Función para testing en consola del navegador
window.testGlampingStore = {
  validateStore: validateStoreStructure,
  testInit: testStoreInitialization,
  logStatus: logStoreStatus,
  simulateApi: simulateApiCall
};