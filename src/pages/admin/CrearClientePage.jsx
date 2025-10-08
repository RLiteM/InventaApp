import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/apiClient';
import ClienteForm from '../../components/admin/ClienteForm';

export default function CrearClientePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSave = async (clienteData) => {
    setIsSaving(true);
    setError(null);
    try {
      await api.post('/clientes', clienteData);
      navigate('/admin/clientes');
    } catch (err) {
      setError('Error al crear el cliente. Verifique los datos e intente de nuevo.');
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="client-form-page">
      <h1>Crear Nuevo Cliente</h1>
      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
      <ClienteForm onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
