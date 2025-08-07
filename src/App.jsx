import { useState } from "react";
import Login from "./pages/Login";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Inicio from "./pages/Inicio";
import Usuarios from "./pages/Usuarios";
import Calendario from "./pages/Calendario";
import Reservas from "./pages/Reservas";
import PQRS from "./pages/PQRS";
import { useConfigStore } from "./store/configStore";
import { useStore } from "./store/useStore";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log("App renderizado, isLoggedIn:", isLoggedIn);

  // PASO 3: Probar ambos stores
  let tema, paginaActual, setPaginaActual, totalReservas;
  try {
    tema = useConfigStore((state) => state.tema);
    console.log("✅ configStore funciona, tema:", tema);
    
    paginaActual = useStore((state) => state.paginaActual);
    setPaginaActual = useStore((state) => state.setPaginaActual);
    totalReservas = useStore((state) => state.reservasHuespedes.length);
    console.log("✅ useStore funciona, paginaActual:", paginaActual, "totalReservas:", totalReservas);
  } catch (error) {
    console.error("❌ Error en stores:", error);
    tema = 'claro';
    paginaActual = 'inicio';
    setPaginaActual = () => {};
    totalReservas = 0;
  }

  if (!isLoggedIn) {
    console.log("Mostrando Login");
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  console.log("Usuario loggeado, mostrando interfaz con tema:", tema, "página:", paginaActual);
  
  // PASO 5E: PRUEBA FINAL - Todas las páginas incluyendo PQRS
  const renderizarPagina = () => {
    console.log("Renderizando página:", paginaActual);
    
    try {
      switch (paginaActual) {
        case 'inicio':
          console.log("✅ Cargando componente Inicio");
          return <Inicio />;
        case 'usuarios':
          console.log("✅ Cargando componente Usuarios");
          return <Usuarios />;
        case 'calendario':
          console.log("✅ Cargando componente Calendario");
          return <Calendario />;
        case 'reservas':
          console.log("✅ Cargando componente Reservas");
          return <Reservas />;
        case 'pqrs':
          console.log("✅ Cargando componente PQRS");
          return <PQRS />;
        default:
          return (
            <div className={`${tema === 'claro' ? 'text-gray-900' : 'text-white'}`}>
              <h2 className="text-2xl font-bold mb-4">🔧 PRUEBA FINAL</h2>
              <p className="mb-4">Probando página: <strong>{paginaActual || 'inicio'}</strong></p>
              <div className={`p-4 rounded border ${
                tema === 'claro' ? 'bg-green-100 border-green-400' : 'bg-green-900/20 border-green-600'
              }`}>
                <p className={`font-medium ${tema === 'claro' ? 'text-green-700' : 'text-green-200'}`}>✅ Inicio: OK</p>
                <p className={`text-sm ${tema === 'claro' ? 'text-green-600' : 'text-green-300'}`}>✅ Usuarios: OK</p>
                <p className={`text-sm ${tema === 'claro' ? 'text-green-600' : 'text-green-300'}`}>✅ Calendario: OK</p>
                <p className={`text-sm ${tema === 'claro' ? 'text-green-600' : 'text-green-300'}`}>✅ Reservas: OK</p>
                <p className={`text-sm ${tema === 'claro' ? 'text-green-600' : 'text-green-300'}`}>🔄 Probando PQRS...</p>
              </div>
              
              <div className={`mt-4 p-4 rounded border ${
                tema === 'claro' ? 'bg-red-100 border-red-400' : 'bg-red-900/20 border-red-600'
              }`}>
                <p className={`font-medium ${tema === 'claro' ? 'text-red-700' : 'text-red-200'}`}>🚨 PRUEBA CRÍTICA:</p>
                <p className={`text-sm ${tema === 'claro' ? 'text-red-600' : 'text-red-300'}`}>Clickea "PQRS" - probablemente aquí está el problema</p>
              </div>
            </div>
          );
      }
    } catch (error) {
      console.error("❌ Error renderizando página:", error);
      return (
        <div className={`${tema === 'claro' ? 'text-gray-900' : 'text-white'}`}>
          <h2 className="text-2xl font-bold mb-4 text-red-600">❌ ERROR</h2>
          <p className="mb-4">Error al cargar la página: {paginaActual}</p>
          <pre className="text-xs p-4 bg-red-100 text-red-800 rounded">
            {error.toString()}
          </pre>
        </div>
      );
    }
  };

  return (
    <div className={`flex h-screen ${tema === 'claro' ? 'bg-gray-100' : 'bg-gray-950'}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={() => {
          console.log("Cerrando sesión desde Header componente");
          setIsLoggedIn(false);
        }} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-6">
          {renderizarPagina()}
        </main>
      </div>
    </div>
  );
}
