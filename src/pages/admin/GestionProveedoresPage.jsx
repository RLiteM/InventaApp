import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import api from '../../api/apiClient';
import '../../styles/GestionProveedores.css';

export default function GestionProveedoresPage({ user }) {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdmin = user?.rol === 'Administrador';

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await api.get('/proveedores');
        setProviders(response.data);
      } catch (err) {
        setError('No se pudo cargar la lista de proveedores.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleDelete = async (providerId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      try {
        await api.delete(`/proveedores/${providerId}`);
        setProviders(providers.filter(p => p.id !== providerId));
      } catch (err) {
        setError('No se pudo eliminar el proveedor.');
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return <div>Cargando proveedores...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="provider-management-page">
      <div className="page-header">
        <h1>Gestión de Proveedores</h1>
        {isAdmin && <Link to="/admin/proveedores/nuevo" className="create-button"><FiPlus /> Crear Proveedor</Link>}
      </div>
      <table className="providers-table">
        <thead>
          <tr>
            <th>Nombre de la Empresa</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {providers.map(provider => (
            <tr key={provider.proveedorId}>
              <td>{provider.nombreEmpresa}</td>
              <td>{provider.telefono || 'N/A'}</td>
              <td>{provider.direccion || 'N/A'}</td>
              <td className="action-buttons">
                <Link to={`/admin/proveedores/editar/${provider.proveedorId}`}>
                  <button className="edit-button"><FiEdit /> Editar</button>
                </Link>
                {isAdmin && <button onClick={() => handleDelete(provider.proveedorId)} className="delete-button"><FiTrash2 /> Eliminar</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
