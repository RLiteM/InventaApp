import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/apiClient';
import UsuarioForm from '../../components/admin/UsuarioForm';

export default function EditarUsuarioPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/usuarios/${id}`)
      .then(response => setInitialData(response.data))
      .catch(err => {
        setError('No se pudo cargar la información del usuario.');
        console.error(err);
      });
  }, [id]);

  const handleSave = async (formData) => {
    setIsSaving(true);
    setError(null);
    console.log("Intentando actualizar con los siguientes datos:", formData);
    try {
      const response = await api.put(`/usuarios/${id}`, formData);
      console.log("Usuario actualizado con éxito, respuesta de la API:", response.data);
      alert("Usuario actualizado con éxito.");
      navigate('/admin/usuarios');
    } catch (err) {
      setError('Error al actualizar el usuario. Verifique los datos e intente de nuevo.');
      console.error("Error al actualizar:", err.response || err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!initialData) {
    return <div>Cargando datos del usuario...</div>;
  }

  return (
    <div className="user-form-page">
      <h1>Editar Usuario</h1>
      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
      <UsuarioForm initialData={initialData} onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
