import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/UsuarioForm.css'; // Reutilizamos estilos base
import '../../styles/ProveedorForm.css';

export default function ProveedorForm({ initialData, onSave, isSaving }) {
  const [proveedor, setProveedor] = useState({ nombreEmpresa: '', telefono: '', direccion: '' });
  const [contactos, setContactos] = useState([{ nombreCompleto: '', cargo: '', telefono: '', email: '' }]);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setProveedor({
        nombreEmpresa: initialData.nombreEmpresa || '',
        telefono: initialData.telefono || '',
        direccion: initialData.direccion || '',
      });
      if (initialData.contactos && initialData.contactos.length > 0) {
        setContactos(initialData.contactos);
      } else {
        setContactos([{ nombreCompleto: '', cargo: '', telefono: '', email: '' }]);
      }
    }
  }, [initialData]);

  const handleProveedorChange = (e) => {
    const { name, value } = e.target;
    setProveedor(prev => ({ ...prev, [name]: value }));
  };

  const handleContactoChange = (index, e) => {
    const { name, value } = e.target;
    const newContactos = [...contactos];
    newContactos[index][name] = value;
    setContactos(newContactos);
  };

  const addContactoRow = () => {
    setContactos([...contactos, { nombreCompleto: '', cargo: '', telefono: '', email: '' }]);
  };

  const removeContactoRow = (index) => {
    const newContactos = contactos.filter((_, i) => i !== index);
    setContactos(newContactos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filtrar contactos que no tienen datos para no enviar objetos vacíos
    const contactosToSend = contactos.filter(c => c.nombreCompleto || c.email);
    onSave({ proveedor, contactos: contactosToSend });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-section">
        <h2>Datos del Proveedor</h2>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Nombre de la Empresa</label>
            <input type="text" name="nombreEmpresa" value={proveedor.nombreEmpresa} onChange={handleProveedorChange} required />
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
        <h2>Contactos</h2>
        {contactos.map((contacto, index) => (
          <div key={index} className="contact-row">
            <div className="form-grid contact-grid">
              <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" name="nombreCompleto" value={contacto.nombreCompleto} onChange={(e) => handleContactoChange(index, e)} />
              </div>
              <div className="form-group">
                <label>Cargo</label>
                <input type="text" name="cargo" value={contacto.cargo} onChange={(e) => handleContactoChange(index, e)} />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="text" name="telefono" value={contacto.telefono} onChange={(e) => handleContactoChange(index, e)} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={contacto.email} onChange={(e) => handleContactoChange(index, e)} />
              </div>
            </div>
            {contactos.length > 1 && (
              <button type="button" className="remove-contact-button" onClick={() => removeContactoRow(index)}>Eliminar Contacto</button>
            )}
          </div>
        ))}
        <button type="button" className="add-contact-button" onClick={addContactoRow}>+ Añadir Contacto</button>
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
