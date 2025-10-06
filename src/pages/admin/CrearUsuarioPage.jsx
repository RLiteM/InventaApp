import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/apiClient';
import UsuarioForm from '../../components/admin/UsuarioForm';

export default function CrearUsuarioPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSave = async (formData) => {
    setIsSaving(true);
    setError(null);
    try {
      await api.post('/usuarios', formData);
      navigate('/admin/usuarios');
    } catch (err) {
      setError('Error al crear el usuario. Verifique los datos e intente de nuevo.');
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="user-form-page">
      <h1>Crear Nuevo Usuario</h1>
      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
      <UsuarioForm onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
