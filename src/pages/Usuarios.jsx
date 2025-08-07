// src/pages/Usuarios.jsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Juan Pérez', correo: 'juan@example.com', contrasena: 'admin123', rol: 'Administrador' },
  ]);
  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '', rol: 'Usuario' });
  const [mostrarClaveFormulario, setMostrarClaveFormulario] = useState(false);
  const [visibilidad, setVisibilidad] = useState({});

  const registrarUsuario = () => {
    if (!form.nombre || !form.correo || !form.contrasena || !form.rol) return;

    const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;

    const nuevoUsuario = {
      ...form,
      id: nuevoId,
    };

    setUsuarios([...usuarios, nuevoUsuario]);
    setForm({ nombre: '', correo: '', contrasena: '', rol: 'Usuario' });
  };

  const toggleContrasena = (id) => {
    setVisibilidad((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Usuarios Registrados</h2>

      {/* Vista de tabla para desktop */}
      <div className="hidden lg:block overflow-x-auto mb-10">
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
                    <span>{visibilidad[u.id] ? u.contrasena : '••••••'}</span>
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

      {/* Vista de cards para móvil */}
      <div className="lg:hidden mb-10 space-y-4">
        {usuarios.map((u) => (
          <div key={u.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-lg">{u.nombre}</h3>
                <p className="text-sm text-gray-400">ID: {u.id}</p>
              </div>
              <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
                {u.rol}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm"><span className="text-gray-400">Email:</span> {u.correo}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Contraseña:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{visibilidad[u.id] ? u.contrasena : '••••••'}</span>
                  <button
                    type="button"
                    onClick={() => toggleContrasena(u.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    {visibilidad[u.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-lg sm:text-xl font-medium mb-4">Registrar Usuario</h3>

      <div className="space-y-4 max-w-full sm:max-w-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-sm sm:text-base"
          />
          <input
            type="email"
            placeholder="Correo"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-sm sm:text-base"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type={mostrarClaveFormulario ? 'text' : 'password'}
              placeholder="Contraseña"
              value={form.contrasena}
              onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded pr-10 text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={() => setMostrarClaveFormulario(!mostrarClaveFormulario)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              {mostrarClaveFormulario ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <select
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-sm sm:text-base"
          >
            <option value="Usuario">Usuario</option>
            <option value="Moderador">Moderador</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>

        <button
          onClick={registrarUsuario}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm sm:text-base"
        >
          Registrar Usuario
        </button>
      </div>
    </div>
  );
}
