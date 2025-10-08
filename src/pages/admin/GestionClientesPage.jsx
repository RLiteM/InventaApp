import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/apiClient';
import '../../styles/GestionProveedores.css'; // Reutilizando estilos

// Hook para obtener los datos del usuario desde localStorage
const useUser = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);
  return user;
};

export default function GestionClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useUser(); // Obtener el usuario actual

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes');
        setClientes(response.data);
      } catch (err) {
        setError('No se pudo cargar la lista de clientes.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const handleDelete = async (clienteId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await api.delete(`/clientes/${clienteId}`);
        setClientes(clientes.filter(c => c.id !== clienteId));
      } catch (err) {
        setError('No se pudo eliminar el cliente.');
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return <div>Cargando clientes...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Determinar los permisos del usuario
  const isAdmin = user?.rol === 'Administrador';
  const canEdit = user?.rol === 'Administrador' || user?.rol === 'Vendedor';

  return (
    <div className="provider-management-page"> {/* Reutilizando clase de estilo */}
      <div className="page-header">
        <h1>Gestión de Clientes</h1>
        <Link to="/admin/clientes/nuevo" className="create-button">Crear Cliente</Link>
      </div>
      <table className="providers-table"> {/* Reutilizando clase de estilo */}
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Identificación Fiscal</th>
            <th>Tipo de Cliente</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            {(isAdmin || canEdit) && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.nombreCompleto || cliente.nombre}</td>
              <td>{cliente.identificacionFiscal}</td>
              <td>{cliente.tipoCliente}</td>
              <td>{cliente.direccion || 'N/A'}</td>
              <td>{cliente.telefono || 'N/A'}</td>
              {(isAdmin || canEdit) && (
                <td className="action-buttons">
                  {canEdit && (
                    <Link to={`/admin/clientes/editar/${cliente.id}`} state={{ cliente: cliente }}>
                      <button className="edit-button">Editar</button>
                    </Link>
                  )}
                  {isAdmin && (
                    <button onClick={() => handleDelete(cliente.id)} className="delete-button">Eliminar</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
