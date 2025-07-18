// src/App.jsx
import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Inicio from "./pages/Inicio";
import Usuarios from "./pages/Usuarios";
import Configuracion from "./pages/Configuracion";
import PQRS from "./pages/PQRS";
import Reserva from "./pages/Reserva";
import ChatHistory from "./pages/ChatHistory";
import Login from "./pages/Login";
import { useStore } from "@/store/useStore";
import { useConfigStore } from "@/store/configStore";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ Nuevo estado
  const paginaActual = useStore((state) => state.paginaActual);
  const tema = useConfigStore((state) => state.tema);

  const paginas = {
    usuarios: <Usuarios />,
    configuracion: <Configuracion />,
    pqrs: <PQRS />,
    reserva: <Reserva />,
    chathistory: <ChatHistory />,
    inicio: <Inicio />,
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className={`flex h-screen ${tema === 'claro' ? 'bg-gray-100' : 'bg-gray-950'}`}>
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={() => setIsLoggedIn(false)} /> {/* ✅ Pasa función */}
        <main className="flex-1 overflow-y-auto p-6">
          {paginas[paginaActual] || <Inicio />}
        </main>
      </div>
    </div>
  );
}
