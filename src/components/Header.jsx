// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { useConfigStore } from "../store/configStore";
import { checkApiHealth } from '../api/reservasApi';

export default function Header({ onLogout }) {
  const tema = useConfigStore((state) => state.tema);
  
  // Estado para conexión
  const [isApiConnected, setIsApiConnected] = useState(null);

  // useEffect para monitorear conexión
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await checkApiHealth();
        setIsApiConnected(isConnected);
      } catch (error) {
        setIsApiConnected(false);
      }
    };

    // Verificar conexión cada 30 segundos
    checkConnection();
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center shadow ${
      tema === 'claro' 
        ? 'bg-white text-gray-900 border-b border-gray-200' 
        : 'bg-gray-900 text-white'
    }`}>
      <div className="flex items-center gap-4">
        <h1 className="text-lg sm:text-xl font-bold">
          <span className="hidden sm:inline">Panel de Administración</span>
          <span className="sm:hidden">Panel Admin</span>
        </h1>
        
        {/* Indicador de API deshabilitado */}
      </div>
      <button
        onClick={onLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base"
      >
        <span className="hidden sm:inline">Cerrar sesión</span>
        <span className="sm:hidden">Salir</span>
      </button>
    </header>
  );
}
