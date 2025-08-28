import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://agente-glamping-production.up.railway.app';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fillCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin_test@ejemplo.com');
      setPassword('admin123');
    } else if (role === 'empleado') {
      setEmail('miguel@gmail.com');
      setPassword('empleado123');
    }
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("✅ Login exitoso:", data.user);
        onLogin(data.user); // Pasar datos del usuario
      } else {
        setError(data.error || 'Error de autenticación');
      }
    } catch (error) {
      console.error("❌ Error de conexión:", error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex justify-center items-center text-white p-4">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          Panel Admin - Glamping
        </h2>

        {error && (
          <div className="bg-red-600 p-3 mb-4 rounded text-center text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 text-sm sm:text-base font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded bg-gray-700 text-white border border-gray-600 text-sm
sm:text-base"
            placeholder="juan@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm sm:text-base font-medium">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded bg-gray-700 text-white border border-gray-600 text-sm sm:text-base"
              placeholder="admin123"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 py-3 rounded font-medium text-sm
sm:text-base transition-colors"
        >
          {loading ? 'Verificando...' : 'Iniciar Sesión'}
        </button>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => fillCredentials('admin')}
            className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded font-medium text-xs sm:text-sm transition-colors"
            disabled={loading}
          >
            👑 Administrador
          </button>
          <button
            type="button"
            onClick={() => fillCredentials('empleado')}
            className="flex-1 bg-orange-600 hover:bg-orange-700 py-2 rounded font-medium text-xs sm:text-sm transition-colors"
            disabled={loading}
          >
            👤 Empleado
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Usa las credenciales de la base de datos PostgreSQL
        </p>
      </form>
    </div>
  );
}