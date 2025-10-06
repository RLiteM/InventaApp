import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/UsuarioForm.css'; // Reutilizamos estilos base
import '../../styles/ProveedorForm.css';

export default function ProveedorForm({ initialData, onSave, isSaving }) {
  const [proveedor, setProveedor] = useState({ nombre_empresa: '', telefono: '', direccion: '' });
  const [contacto, setContacto] = useState({ nombre_completo: '', cargo: '', telefono: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setProveedor({
        nombre_empresa: initialData.nombreEmpresa || '',
        telefono: initialData.telefono || '',
        direccion: initialData.direccion || '',
      });
      // Si hay contactos, poblamos el primero (lógica simple)
      if (initialData.contactos && initialData.contactos.length > 0) {
        const mainContact = initialData.contactos[0];
        setContacto({
          nombre_completo: mainContact.nombreCompleto || '',
          cargo: mainContact.cargo || '',
          telefono: mainContact.telefono || '',
          email: mainContact.email || '',
        });
      }
    }
  }, [initialData]);

  const handleProveedorChange = (e) => {
    const { name, value } = e.target;
    setProveedor(prev => ({ ...prev, [name]: value }));
  };

  const handleContactoChange = (e) => {
    const { name, value } = e.target;
    setContacto(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ proveedor, contacto });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-section">
        <h2>Datos del Proveedor</h2>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Nombre de la Empresa</label>
            <input type="text" name="nombre_empresa" value={proveedor.nombre_empresa} onChange={handleProveedorChange} required />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input type="text" name="telefono" value={proveedor.telefono} onChange={handleProveedorChange} />
          </div>
          <div className="form-group">
            <label>Dirección</label>
            <input type="text" name="direccion" value={proveedor.direccion} onChange={handleProveedorChange} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2>Datos del Contacto Principal (Opcional)</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Nombre Completo del Contacto</label>
            <input type="text" name="nombre_completo" value={contacto.nombre_completo} onChange={handleContactoChange} />
          </div>
          <div className="form-group">
            <label>Cargo</label>
            <input type="text" name="cargo" value={contacto.cargo} onChange={handleContactoChange} />
          </div>
          <div className="form-group">
            <label>Teléfono del Contacto</label>
            <input type="text" name="telefono" value={contacto.telefono} onChange={handleContactoChange} />
          </div>
          <div className="form-group">
            <label>Email del Contacto</label>
            <input type="email" name="email" value={contacto.email} onChange={handleContactoChange} />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={() => navigate('/admin/proveedores')} disabled={isSaving}>
          Cancelar
        </button>
        <button type="submit" className="save-button" disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar Proveedor'}
        </button>
      </div>
    </form>
  );
}
