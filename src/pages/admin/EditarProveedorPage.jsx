import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/apiClient';
import ProveedorForm from '../../components/admin/ProveedorForm';

export default function EditarProveedorPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Para la edición, necesitamos tanto los datos del proveedor como sus contactos
    const fetchProviderData = async () => {
      try {
        const response = await api.get(`/proveedores/${id}`);
        // La API de un solo proveedor debería devolver sus contactos asociados
        setInitialData(response.data);
      } catch (err) {
        setError('No se pudo cargar la información del proveedor.');
        console.error(err);
      }
    };
    fetchProviderData();
  }, [id]);

  const handleSave = async ({ proveedor, contacto }) => {
    setIsSaving(true);
    setError(null);
    try {
      // La edición se centra en los datos del proveedor principal
      // La gestión de múltiples contactos se podría añadir como una mejora futura
      await api.put(`/proveedores/${id}`, proveedor);
      
      // Opcional: Lógica para actualizar o crear un contacto si ha cambiado.
      // Por simplicidad y siguiendo el prompt, nos centramos en la actualización del proveedor.

      navigate('/admin/proveedores');
    } catch (err) {
      setError('Error al actualizar el proveedor. Verifique los datos e intente de nuevo.');
      console.error(err);
      setIsSaving(false);
    }
  };

  if (!initialData) {
    return <div>Cargando datos del proveedor...</div>;
  }

  return (
    <div className="provider-form-page">
      <h1>Editar Proveedor</h1>
      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
      <ProveedorForm initialData={initialData} onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
