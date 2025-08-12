// API Mock para testing y desarrollo
export const mockReservas = [
  {
    id: "MOCK-001",
    nombre: "Ana García López",
    numero: "+57 300 123 4567",
    email: "ana.garcia@email.com",
    numeroPersonas: 2,
    fechaEntrada: "2025-08-15",
    fechaSalida: "2025-08-17",
    domo: "Centary",
    servicios: [
      { nombre: "Cena romántica", precio: 80000, descripcion: "Cena para dos personas con vista al lago" }
    ],
    montoAPagar: 350000,
    metodoPago: "Transferencia",
    observaciones: "Aniversario de bodas - solicitan decoración especial"
  },
  {
    id: "MOCK-002",
    nombre: "Carlos Rodríguez Pérez",
    numero: "+57 310 987 6543",
    email: "carlos.rodriguez@email.com",
    numeroPersonas: 4,
    fechaEntrada: "2025-08-18",
    fechaSalida: "2025-08-20",
    domo: "Polaris",
    servicios: [],
    montoAPagar: 480000,
    metodoPago: "Efectivo",
    observaciones: "Viaje familiar con niños"
  },
  {
    id: "MOCK-003",
    nombre: "María Fernández Torres",
    numero: "+57 320 456 7890",
    email: "maria.fernandez@email.com",
    numeroPersonas: 1,
    fechaEntrada: "2025-08-22",
    fechaSalida: "2025-08-24",
    domo: "Sirius",
    servicios: [
      { nombre: "Spa y relajación", precio: 120000, descripcion: "Masajes y tratamientos de spa" },
      { nombre: "Tour de observación", precio: 60000, descripcion: "Tour guiado para observar estrellas" }
    ],
    montoAPagar: 420000,
    metodoPago: "Tarjeta",
    observaciones: "Primera vez en glamping - muy emocionada"
  }
];

// Mock API functions
export const mockFetchReservas = async (shouldFail = false, delay = 1000) => {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, delay));
  
  if (shouldFail) {
    throw new Error('Error de conexión con el servidor');
  }
  
  return mockReservas;
};

export const mockCreateReserva = async (reservaData, shouldFail = false) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (shouldFail) {
    throw new Error('Error al crear la reserva');
  }
  
  const newReserva = {
    ...reservaData,
    id: `MOCK-${Date.now()}`,
  };
  
  mockReservas.push(newReserva);
  return newReserva;
};

export const mockUpdateReserva = async (reservaId, reservaData, shouldFail = false) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  if (shouldFail) {
    throw new Error('Error al actualizar la reserva');
  }
  
  const index = mockReservas.findIndex(r => r.id === reservaId);
  if (index === -1) {
    throw new Error('Reserva no encontrada');
  }
  
  mockReservas[index] = { ...mockReservas[index], ...reservaData };
  return mockReservas[index];
};

export const mockDeleteReserva = async (reservaId, shouldFail = false) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (shouldFail) {
    throw new Error('Error al eliminar la reserva');
  }
  
  const index = mockReservas.findIndex(r => r.id === reservaId);
  if (index === -1) {
    throw new Error('Reserva no encontrada');
  }
  
  mockReservas.splice(index, 1);
  return { success: true };
};

// Función para habilitar modo mock
export const enableMockMode = () => {
  // Sobrescribir las funciones reales de API con las mock
  const originalModule = import('../api/reservasApi.js');
  
  return {
    fetchReservas: mockFetchReservas,
    createReserva: mockCreateReserva,
    updateReserva: mockUpdateReserva,
    deleteReserva: mockDeleteReserva,
    mockReservas,
    resetMockData: () => {
      mockReservas.length = 0;
      mockReservas.push(...[
        {
          id: "MOCK-001",
          nombre: "Ana García López",
          numero: "+57 300 123 4567",
          email: "ana.garcia@email.com",
          numeroPersonas: 2,
          fechaEntrada: "2025-08-15",
          fechaSalida: "2025-08-17",
          domo: "Centary",
          servicios: [
            { nombre: "Cena romántica", precio: 80000, descripcion: "Cena para dos personas con vista al lago" }
          ],
          montoAPagar: 350000,
          metodoPago: "Transferencia",
          observaciones: "Aniversario de bodas - solicitan decoración especial"
        }
      ]);
    }
  };
};