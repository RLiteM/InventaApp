import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/apiClient';
import ProveedorForm from '../../components/admin/ProveedorForm';

export default function CrearProveedorPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSave = async ({ proveedor, contacto }) => {
    setIsSaving(true);
    setError(null);
    try {
      // Paso 1: Crear el proveedor
      const proveedorResponse = await api.post('/proveedores', proveedor);
      const nuevoProveedorId = proveedorResponse.data.id;

      // Paso 2: Si hay datos de contacto, crearlo y asociarlo
      const contactoData = contacto;
      if (contactoData.nombre_completo || contactoData.email) { // Crear contacto si hay al menos un nombre o email
        await api.post('/contactoproveedor', {
          ...contactoData,
          proveedor_id: nuevoProveedorId,
        });
      }

      navigate('/admin/proveedores');

    } catch (err) {
      setError('Error al crear el proveedor. Verifique los datos e intente de nuevo.');
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="provider-form-page">
      <h1>Crear Nuevo Proveedor</h1>
      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
      <ProveedorForm onSave={handleSave} isSaving={isSaving} />
    </div>
  );
}
