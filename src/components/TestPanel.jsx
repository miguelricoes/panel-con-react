import { useState } from 'react';
import { useStore } from '../store/useStore';
import { toggleMockMode } from '../api/reservasApi';
import { logStoreStatus } from '../utils/testValidation';

export default function TestPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const { 
    reservasHuespedes, 
    isLoading, 
    syncError, 
    lastSync,
    cargarReservas,
    forzarSincronizacion 
  } = useStore();

  if (!import.meta.env.DEV) return null;

  const handleToggleMock = (enable) => {
    toggleMockMode(enable);
  };

  const handleTestError = async () => {
    // Simular error deshabilitando mock temporalmente
    await useStore.getState().cargarReservas();
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      background: 'white',
      border: '2px solid #007bff',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      minWidth: '250px',
      fontSize: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>🔧 Panel de Testing</strong>
        <button 
          onClick={() => setIsVisible(!isVisible)}
          style={{ border: 'none', background: 'none', cursor: 'pointer' }}
        >
          {isVisible ? '▼' : '▶'}
        </button>
      </div>
      
      {isVisible && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>Estado Actual:</strong>
            <div>📊 Reservas: {reservasHuespedes.length}</div>
            <div>⏳ Cargando: {isLoading ? 'Sí' : 'No'}</div>
            <div>❌ Error: {syncError || 'Ninguno'}</div>
            <div>🕒 Última sync: {lastSync ? new Date(lastSync).toLocaleTimeString() : 'Nunca'}</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <button 
              onClick={cargarReservas}
              disabled={isLoading}
              style={{ 
                padding: '4px 8px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              🔄 Cargar Reservas
            </button>
            
            <button 
              onClick={forzarSincronizacion}
              disabled={isLoading}
              style={{ 
                padding: '4px 8px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              🚀 Forzar Sync
            </button>
            
            <button 
              onClick={() => logStoreStatus()}
              style={{ 
                padding: '4px 8px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📋 Log Estado
            </button>
            
            <hr style={{ margin: '5px 0' }} />
            
            <button 
              onClick={() => handleToggleMock(true)}
              style={{ 
                padding: '4px 8px', 
                border: '1px solid #28a745', 
                borderRadius: '4px',
                cursor: 'pointer',
                background: '#d4edda'
              }}
            >
              🔧 Modo Mock
            </button>
            
            <button 
              onClick={() => handleToggleMock(false)}
              style={{ 
                padding: '4px 8px', 
                border: '1px solid #dc3545', 
                borderRadius: '4px',
                cursor: 'pointer',
                background: '#f8d7da'
              }}
            >
              🔗 Modo Real API
            </button>
          </div>
        </div>
      )}
    </div>
  );
}