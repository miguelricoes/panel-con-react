// src/components/Header.jsx
import React from "react";

export default function Header({ onLogout }) {
  return (
    <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">Panel de Administración</h1>
      <button
        onClick={onLogout}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
