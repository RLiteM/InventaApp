import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/apiClient';
import ClienteForm from '../../components/admin/ClienteForm';

export default function EditarClientePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Hook para acceder al state de la ruta

  useEffect(() => {
    // Ya no se hace fetch a la API. Se usan los datos pasados en el state de la ruta.
    if (location.state?.cliente) {
      setInitialData(location.state.cliente);
    } else {
      // Si por alguna razón no se reciben los datos, mostrar un error.
      setError('No se pudieron cargar los datos del cliente para la edición.');
    }
  }, [id, location.state]);

  const handleSave = async (clienteData) => {
    setIsSaving(true);
    setError(null);
    try {
      await api.put(`/clientes/${id}`, clienteData);
      navigate('/admin/clientes');
    } catch (err) {
      let errorMessage = 'Error al actualizar el cliente.';
      if (err.response) {
        errorMessage += ` (Error ${err.response.status}: ${err.response.data.message || 'Datos inválidos'})`;
      } else if (err.request) {
        errorMessage += ' (El servidor no responde)';
      } else {
        errorMessage += ` (Error: ${err.message})`;
      }
      setError(errorMessage);
      console.error(err);
      setIsSaving(false);
    }
  };

  if (!initialData && !error) {
    return <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '5px' }}>Cargando datos del cliente...</div>;
  }

  if (error) {
    return <div className="error-message" style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '5px' }}>{error}</div>;
  }

  return (
    <div className="client-form-page">
      <h1>Editar Cliente</h1>
      <ClienteForm initialData={initialData} onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
