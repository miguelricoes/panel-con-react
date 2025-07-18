// src/components/Header.jsx
import React from "react";
import { useConfigStore } from "@/store/configStore";

export default function Header({ onLogout }) {
  const tema = useConfigStore((state) => state.tema);

  return (
    <header className={`px-6 py-4 flex justify-between items-center shadow ${
      tema === 'claro' 
        ? 'bg-white text-gray-900 border-b border-gray-200' 
        : 'bg-gray-900 text-white'
    }`}>
      <h1 className="text-xl font-bold">Panel de Administración</h1>
      <button
        onClick={onLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
