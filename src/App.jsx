import { useState, lazy, Suspense, useEffect } from "react";
import Login from "./pages/Login";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TestPanel from "./components/TestPanel";
import { useConfigStore } from "./store/configStore";
import { useStore } from "./store/useStore";

// Lazy loading simplificado para evitar problemas
const Inicio = lazy(() => import("./pages/Inicio"));
const Usuarios = lazy(() => import("./pages/Usuarios"));
const Calendario = lazy(() => import("./pages/Calendario"));
const Reservas = lazy(() => import("./pages/Reservas"));
const PQRS = lazy(() => import("./pages/PQRS"));

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  console.log("App renderizado, isLoggedIn:", isLoggedIn);

  // Interceptar errores que puedan ocurrir después del login
  useEffect(() => {
    const handleError = (event) => {
      console.error("❌ Error global capturado:", event.error);
      setError(event.error.message);
    };

    const handleUnhandledRejection = (event) => {
      console.error("❌ Promesa rechazada:", event.reason);
      setError(event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Detectado</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // PASO 3: Usar stores de forma segura
  const tema = useConfigStore((state) => state?.tema) || 'claro';
  const paginaActual = useStore((state) => state?.paginaActual) || 'inicio';
  const setPaginaActual = useStore((state) => state?.setPaginaActual) || (() => {});
  const totalReservas = useStore((state) => state?.reservasHuespedes?.length) || 0;
  
  console.log("✅ Stores cargados:", { tema, paginaActual, totalReservas });

  if (!isLoggedIn) {
    console.log("Mostrando Login");
    return <Login onLogin={(user) => {
      console.log("Usuario autenticado:", user);
      setIsLoggedIn(true);
    }} />;
  }

  console.log("Usuario loggeado, mostrando interfaz con tema:", tema, "página:", paginaActual);
  
  const paginas = {
    usuarios: <Usuarios />,
    pqrs: <PQRS />,
    calendario: <Calendario />,
    reservas: <Reservas />,
    inicio: <Inicio />,
  };

  // Componente de carga
  const LoadingSpinner = () => (
    <div className={`flex items-center justify-center h-64 ${tema === 'claro' ? 'text-gray-900' : 'text-white'}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
      <span className="ml-3">Cargando...</span>
    </div>
  );

  return (
    <div className={`flex h-screen ${tema === 'claro' ? 'bg-gray-100' : 'bg-gray-950'}`}>
      <TestPanel />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={() => {
          console.log("Cerrando sesión desde Header componente");
          setIsLoggedIn(false);
        }} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-6">
          <Suspense fallback={<LoadingSpinner />}>
            {(() => {
              try {
                console.log("🔄 Intentando renderizar página:", paginaActual);
                const componente = paginas[paginaActual] || <Inicio />;
                console.log("✅ Componente seleccionado:", componente);
                return componente;
              } catch (error) {
                console.error("❌ Error renderizando página:", paginaActual, error);
                return <div className="text-red-500">Error cargando página: {error.message}</div>;
              }
            })()}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
