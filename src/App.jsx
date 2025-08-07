import { useState, lazy, Suspense } from "react";
import Login from "./pages/Login";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useConfigStore } from "./store/configStore";
import { useStore } from "./store/useStore";

// Lazy loading de páginas - solo se cargan cuando se necesitan
const Inicio = lazy(() => import("./pages/Inicio"));
const Usuarios = lazy(() => import("./pages/Usuarios"));
const Calendario = lazy(() => import("./pages/Calendario"));
const Reservas = lazy(() => import("./pages/Reservas"));
const PQRS = lazy(() => import("./pages/PQRS"));

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
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={() => {
          console.log("Cerrando sesión desde Header componente");
          setIsLoggedIn(false);
        }} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-6">
          <Suspense fallback={<LoadingSpinner />}>
            {paginas[paginaActual] || <Inicio />}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
