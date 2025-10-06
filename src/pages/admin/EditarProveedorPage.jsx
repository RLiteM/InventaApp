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
    if (!id) return; // No hacer nada si el id no está disponible todavía

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

  const handleSave = async ({ proveedor, contactos }) => {
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        ...proveedor,
        contactos: contactos.map(({ id, ...rest }) => {
          // Si el contacto tiene un ID, lo enviamos para que el backend lo identifique.
          // Si no tiene ID (es nuevo), solo enviamos el resto de datos.
          return id ? { id, ...rest } : rest;
        }),
      };

      await api.put(`/proveedores/${id}`, payload);

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
