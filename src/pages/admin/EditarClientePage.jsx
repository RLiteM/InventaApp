import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/apiClient';
import ClienteForm from '../../components/admin/ClienteForm';

export default function EditarClientePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return; // No hacer nada si el id no está disponible

    const fetchClienteData = async () => {
      try {
        const response = await api.get(`/clientes/${id}`);
        // La API puede devolver el objeto directamente o envuelto en { data: {...} }
        const clienteData = response.data.data || response.data;
        setInitialData(clienteData);
      } catch (err) {
        setError('No se pudo cargar la información del cliente.');
        console.error(err);
      }
    };

    fetchClienteData();
  }, [id]);

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
