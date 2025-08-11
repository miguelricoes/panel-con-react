// Backup del PQRS con filtros - guardado por seguridad
import { useState, useMemo } from "react";
import { useStore } from "../store/useStore";
import { useConfigStore } from "../store/configStore";
import { Eye, Calendar, User, FileText, Filter, Search } from "lucide-react";

export default function PQRS() {
  console.log("🔄 PQRS componente iniciando...");
  
  let pqrsPendientes, reservasHuespedes, tema, setPaginaActual;
  
  try {
    pqrsPendientes = useStore((state) => state.pqrsPendientes);
    reservasHuespedes = useStore((state) => state.reservasHuespedes);
    tema = useConfigStore((state) => state.tema);
    setPaginaActual = useStore((state) => state.setPaginaActual);
    
    console.log("✅ PQRS datos cargados:", { 
      totalPQRS: pqrsPendientes?.length || 0,
      totalReservas: reservasHuespedes?.length || 0,
      tema 
    });
  } catch (error) {
    console.error("❌ Error en PQRS stores:", error);
    return <div>Error cargando PQRS</div>;
  }

  return (
    <div className={`w-full ${tema === 'claro' ? 'text-gray-900' : 'text-white'}`}>
      <h2 className="text-xl sm:text-2xl font-bold mb-6">PQRS de Clientes</h2>
      <p>Total PQRS: {pqrsPendientes?.length || 0}</p>
      <p>Componente funcionando correctamente</p>
    </div>
  );
}