
import { useState, useEffect } from 'react';
import '../../styles/ContactoFormModal.css';

export default function ContactoFormModal({ contacto, onSave, onClose, isOpen }) {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    cargo: '',
    telefono: '',
    email: '',
  });

  useEffect(() => {
    // Si se pasa un contacto para editar, llena el formulario; si no, lo deja vacío para crear uno nuevo.
    if (contacto) {
      setFormData({
        nombreCompleto: contacto.nombreCompleto || '',
        cargo: contacto.cargo || '',
        telefono: contacto.telefono || '',
        email: contacto.email || '',
      });
    } else {
      setFormData({
        nombreCompleto: '',
        cargo: '',
        telefono: '',
        email: '',
      });
    }
  }, [contacto, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar que al menos el nombre esté presente
    if (!formData.nombreCompleto.trim()) {
      alert('El nombre completo es obligatorio.');
      return;
    }
    onSave({ ...contacto, ...formData });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{contacto ? 'Editar Contacto' : 'Añadir Contacto'}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Nombre Completo</label>
            <input type="text" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Cargo</label>
            <input type="text" name="cargo" value={formData.cargo} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="save-button">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
