import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/apiClient';
import ProveedorForm from '../../components/admin/ProveedorForm';

export default function CrearProveedorPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSave = async ({ proveedor, contactos }) => {
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        ...proveedor,
        contactos: contactos.map(({ id, ...rest }) => {
          // Si el contacto no tiene un ID (es nuevo), solo enviamos el resto de los datos.
          // Si tiene un ID, lo incluimos para que el backend pueda identificarlo (aunque en creación no debería haber IDs).
          return id ? { id, ...rest } : rest;
        }),
      };

      await api.post('/proveedores', payload);
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
