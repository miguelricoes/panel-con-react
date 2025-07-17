// src/pages/Usuarios.jsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Juan Pérez', correo: 'juan@example.com', contraseña: 'admin123', rol: 'Administrador' },
  ]);
  const [form, setForm] = useState({ nombre: '', correo: '', contraseña: '', rol: 'Usuario' });
  const [mostrarClaveFormulario, setMostrarClaveFormulario] = useState(false);
  const [visibilidad, setVisibilidad] = useState({});

  const registrarUsuario = () => {
    if (!form.nombre || !form.correo || !form.contraseña || !form.rol) return;

    const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;

    const nuevoUsuario = {
      ...form,
      id: nuevoId,
    };

    setUsuarios([...usuarios, nuevoUsuario]);
    setForm({ nombre: '', correo: '', contraseña: '', rol: 'Usuario' });
  };

  const toggleContrasena = (id) => {
    setVisibilidad((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-semibold mb-6">Usuarios Registrados</h2>

      <div className="overflow-x-auto mb-10">
        <table className="w-full border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Correo</th>
              <th className="px-4 py-2 border">Rol</th>
              <th className="px-4 py-2 border">Contraseña</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="text-center">
                <td className="border px-4 py-2">{u.id}</td>
                <td className="border px-4 py-2">{u.nombre}</td>
                <td className="border px-4 py-2">{u.correo}</td>
                <td className="border px-4 py-2">{u.rol}</td>
                <td className="border px-4 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <span>{visibilidad[u.id] ? u.contraseña : '••••••'}</span>
                    <button
                      type="button"
                      onClick={() => toggleContrasena(u.id)}
                      className="text-gray-400"
                    >
                      {visibilidad[u.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-medium mb-4">Registrar Usuario</h3>

      <div className="space-y-4 max-w-lg">
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
        />
        <input
          type="email"
          placeholder="Correo"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
        />
        <div className="relative">
          <input
            type={mostrarClaveFormulario ? 'text' : 'password'}
            placeholder="Contraseña"
            value={form.contraseña}
            onChange={(e) => setForm({ ...form, contraseña: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setMostrarClaveFormulario(!mostrarClaveFormulario)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400"
          >
            {mostrarClaveFormulario ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <select
          value={form.rol}
          onChange={(e) => setForm({ ...form, rol: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
        >
          <option value="Usuario">Usuario</option>
          <option value="Moderador">Moderador</option>
          <option value="Administrador">Administrador</option>
        </select>

        <button
          onClick={registrarUsuario}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Registrar Usuario
        </button>
      </div>
    </div>
  );
}
