// src/pages/Login.jsx
import { useState } from "react";
import { useStore } from "@/store/useStore";

export default function Login({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const usuarios = useStore((state) => state.usuarios);

  const handleLogin = (e) => {
    e.preventDefault();

    const usuario = usuarios.find(
      (u) => u.correo === correo && u.contrasena === contrasena
    );

    if (!usuario) {
      setError("Credenciales inválidas");
      return;
    }

    if (usuario.rol !== "Administrador") {
      setError("Acceso solo permitido a administradores");
      return;
    }

    // ✅ Login correcto
    setError("");
    onLogin();
  };

  return (
    <div className="h-screen bg-gray-900 flex justify-center items-center text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Iniciar sesión
        </h2>

        {error && (
          <div className="bg-red-600 p-2 mb-4 rounded text-center">{error}</div>
        )}

        <div className="mb-4">
          <label className="block mb-1">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1">Contraseña</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
