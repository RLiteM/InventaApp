import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import api from '../../api/apiClient';
import '../../styles/GestionUsuarios.css';

export default function GestionUsuariosPage({ user }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdmin = user?.rol === 'Administrador';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/usuarios');
        setUsers(response.data);
      } catch (err) {
        setError('No se pudo cargar la lista de usuarios.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await api.delete(`/usuarios/${userId}`);
        // Actualizar el estado local para reflejar la eliminación
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError('No se pudo eliminar el usuario. Es posible que esté asociado a otros registros.');
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return <div>Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-management-page">
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
        {isAdmin && <Link to="/admin/usuarios/nuevo" className="create-button"><FiPlus /> Crear Usuario</Link>}
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Nombre de Usuario</th>
            <th>Rol</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.usuarioId}>
              <td>{user.nombreCompleto}</td>
              <td>{user.nombreUsuario}</td>
              <td>{user.nombreRol}</td>
              <td>{user.correo || 'N/A'}</td>
              <td>{user.telefono || 'N/A'}</td>
              <td className="action-buttons">
                <Link to={`/admin/usuarios/editar/${user.usuarioId}`}>
                  <button className="edit-button"><FiEdit /> Editar</button>
                </Link>
                {isAdmin && <button onClick={() => handleDelete(user.usuarioId)} className="delete-button"><FiTrash2 /> Eliminar</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
