import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import {
  Plus,
  Edit2,
  Trash2,
  User,
  Mail,
  Calendar,
  Shield,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

const Usuarios = () => {
  const {
    usuarios,
    loadingUsuarios,
    fetchUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    regeneratePassword
  } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'limitado'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [showPasswords, setShowPasswords] = useState(true);
  const [regeneratingPassword, setRegeneratingPassword] = useState(null);

  useEffect(() => {
    // Cargar usuarios con contraseñas para admin
    fetchUsuarios(true);
  }, [fetchUsuarios]);

  const resetForm = () => {
    setFormData({ nombre: '', email: '', password: '', rol: 'limitado' });
    setEditingUser(null);
    setShowPassword(false);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nombre || !formData.email) {
      setError('Nombre y email son requeridos');
      return;
    }

    let result;
    if (editingUser) {
      result = await updateUsuario(editingUser.id, {
        nombre: formData.nombre,
        email: formData.email,
        rol: formData.rol,
        activo: true
      });
    } else {
      result = await createUsuario({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password || undefined, // Opcional
        rol: formData.rol
      });
    }

    if (result.success) {
      const message = editingUser ? 'Usuario actualizado exitosamente' :
        `Usuario creado exitosamente${result.data?.temp_password ? '. Contraseña: ' + result.data.temp_password : ''}`;
      setSuccess(message);

      // Recargar usuarios con contraseñas
      await fetchUsuarios(true);

      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 3000);
    } else {
      setError(result.error);
    }
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      rol: usuario.rol
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleDelete = async (userId, userEmail) => {
    if (userEmail?.toLowerCase() === 'juan@example.com') {
      setError('No se puede eliminar el usuario administrador principal');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (confirm('¿Estás seguro de eliminar este usuario?\n\nEsta acción no se puede deshacer.')) {
      setDeletingUserId(userId);

      try {
        setError('');
        setSuccess('');

        const result = await deleteUsuario(userId);
        if (result.success) {
          setSuccess('Usuario eliminado exitosamente');
          setTimeout(() => setSuccess(''), 3000);
          await fetchUsuarios(true);
        } else {
          setError(result.error || 'Error eliminando usuario');
          setTimeout(() => setError(''), 5000);
        }
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        setError('Error de conexión eliminando usuario');
        setTimeout(() => setError(''), 5000);
      } finally {
        setDeletingUserId(null);
      }
    }
  };

  const handleRegeneratePassword = async (userId, userName) => {
    if (confirm(`¿Regenerar contraseña para ${userName}?\n\nEsto creará una nueva contraseña temporal.`)) {
      setRegeneratingPassword(userId);
      try {
        const result = await regeneratePassword(userId);
        if (result.success) {
          setSuccess(`Nueva contraseña generada para ${userName}: ${result.password}`);
          setTimeout(() => setSuccess(''), 10000); // 10 segundos
        } else {
          setError(result.error);
          setTimeout(() => setError(''), 5000);
        }
      } catch (error) {
        setError('Error regenerando contraseña');
        setTimeout(() => setError(''), 5000);
      } finally {
        setRegeneratingPassword(null);
      }
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loadingUsuarios) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">Administra los usuarios del panel de control</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nuevo Usuario
        </button>
      </div>

      {/* Mensajes de éxito/error globales */}
      {(success || error) && (
        <div className={`p-4 rounded-lg ${success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {success || error}
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  Contraseña Temporal
                  <button
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="text-blue-600 hover:text-blue-900"
                    title={showPasswords ? "Ocultar contraseñas" : "Mostrar contraseñas"}
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo de Acceso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último Acceso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{usuario.nombre}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {usuario.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {showPasswords && usuario.temp_password ? (
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {usuario.temp_password}
                          </code>
                          <button
                            onClick={() => handleRegeneratePassword(usuario.id, usuario.nombre)}
                            disabled={regeneratingPassword === usuario.id}
                            className="text-blue-600 hover:text-blue-900 text-xs flex items-center gap-1"
                            title="Regenerar contraseña"
                          >
                            {regeneratingPassword === usuario.id ? (
                              <div className="animate-spin h-3 w-3 border border-blue-600 border-t-transparent rounded-full" />
                            ) : (
                              <RefreshCw className="h-3 w-3" />
                            )}
                            Regenerar
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          {showPasswords ? "Sin contraseña temporal" : "••••••••"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      usuario.rol === 'completo'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {usuario.rol === 'completo' ? (
                        <ShieldCheck className="h-3 w-3" />
                      ) : (
                        <Shield className="h-3 w-3" />
                      )}
                      {usuario.rol === 'completo' ? 'Acceso Completo' : 'Acceso Limitado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {usuario.fecha_creacion ? new Date(usuario.fecha_creacion).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {usuario.ultimo_acceso ? (
                      new Date(usuario.ultimo_acceso).toLocaleString()
                    ) : (
                      'Nunca'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(usuario)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Editar usuario"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(usuario.id, usuario.email)}
                        className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                        title="Eliminar usuario"
                        disabled={usuario.email === 'juan@example.com' || deletingUserId === usuario.id}
                      >
                        {deletingUserId === usuario.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de creación/edición */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
              </h3>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                    placeholder="Nombre completo del usuario"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                    placeholder="correo@example.com"
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña (opcional)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="Se generará automáticamente si se deja vacío"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Si no especificas contraseña, se generará una automáticamente
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Acceso
                  </label>
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData({...formData, rol: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="limitado">Acceso Limitado</option>
                    <option value="completo">Acceso Completo</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    <strong>Limitado:</strong> Solo Dashboard y Reservas<br />
                    <strong>Completo:</strong> Acceso a todo el panel
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {editingUser ? 'Actualizar' : 'Crear Usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;