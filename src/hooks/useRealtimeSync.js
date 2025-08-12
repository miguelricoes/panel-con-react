import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

// Hook personalizado para sincronización en tiempo real
export const useRealtimeSync = (intervalMs = 30000) => { // 30 segundos por defecto
  const intervalRef = useRef(null);
  const sincronizarReservas = useStore((state) => state.sincronizarReservas);
  const isLoading = useStore((state) => state.isLoading);

  useEffect(() => {
    // Función para iniciar la sincronización periódica
    const startPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(async () => {
        // Solo sincronizar si no está cargando actualmente
        if (!isLoading) {
          try {
            await sincronizarReservas();
          } catch (error) {
            console.error('Error en sincronización automática:', error);
          }
        }
      }, intervalMs);
    };

    // Iniciar polling
    startPolling();

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sincronizarReservas, intervalMs, isLoading]);

  // Función para forzar una sincronización inmediata
  const forceSync = async () => {
    if (!isLoading) {
      await sincronizarReservas();
    }
  };

  return {
    forceSync
  };
};

// Hook para detectar visibilidad de la página (para pausar/reanudar sincronización)
export const usePageVisibility = () => {
  const isVisible = useRef(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisible.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible.current;
};

// Hook combinado para sincronización inteligente
export const useSmartSync = (intervalMs = 30000) => {
  const { forceSync } = useRealtimeSync(intervalMs);
  const isVisible = usePageVisibility();
  const sincronizarReservas = useStore((state) => state.sincronizarReservas);
  const isLoading = useStore((state) => state.isLoading);

  useEffect(() => {
    let intervalId;

    if (isVisible) {
      // Sincronización más frecuente cuando la página está visible
      intervalId = setInterval(async () => {
        if (!isLoading) {
          await sincronizarReservas();
        }
      }, intervalMs);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isVisible, sincronizarReservas, intervalMs, isLoading]);

  return { forceSync };
};

export default useRealtimeSync;