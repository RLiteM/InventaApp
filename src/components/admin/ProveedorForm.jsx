import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactoFormModal from './ContactoFormModal'; // Importar el nuevo modal
import '../../styles/UsuarioForm.css';
import '../../styles/ProveedorForm.css';

export default function ProveedorForm({ initialData, onSave, isSaving }) {
  const [proveedor, setProveedor] = useState({ nombreEmpresa: '', telefono: '', direccion: '' });
  const [contactos, setContactos] = useState([]);
  const navigate = useNavigate();

  // --- State para el Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContacto, setCurrentContacto] = useState(null); // null para crear, objeto para editar

  useEffect(() => {
    if (initialData) {
      setProveedor({
        nombreEmpresa: initialData.nombreEmpresa || '',
        telefono: initialData.telefono || '',
        direccion: initialData.direccion || '',
      });
      // Asignar un ID temporal a los contactos que no lo tienen para manejo en el cliente
      const initialContactos = (initialData.contactos || []).map((c, index) => ({
        ...c,
        // Si el contacto de la API tiene un ID real, úsalo. Si no, crea un ID temporal único.
        tempId: c.id || `temp-${Date.now()}-${index}`,
      }));
      setContactos(initialContactos);
    }
  }, [initialData]);

  const handleProveedorChange = (e) => {
    const { name, value } = e.target;
    setProveedor(prev => ({ ...prev, [name]: value }));
  };

  // --- Lógica para manejar el modal y los contactos ---

  const handleOpenModalForEdit = (contacto) => {
    setCurrentContacto(contacto);
    setIsModalOpen(true);
  };

  const handleOpenModalForCreate = () => {
    setCurrentContacto(null); // Asegurarse de que el formulario esté vacío
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentContacto(null);
  };

  const handleSaveContacto = (contactoData) => {
    if (currentContacto) {
      // Editar contacto existente
      setContactos(contactos.map(c => (c.tempId === currentContacto.tempId ? { ...c, ...contactoData } : c)));
    } else {
      // Añadir nuevo contacto con un ID temporal
      const newContacto = { ...contactoData, tempId: `temp-${Date.now()}` };
      setContactos([...contactos, newContacto]);
    }
    handleCloseModal();
  };

  const handleDeleteContacto = (tempIdToDelete) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
      setContactos(contactos.filter(c => c.tempId !== tempIdToDelete));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Antes de enviar, eliminamos los tempId para no mandarlos a la API
    const contactosToSend = contactos.map(({ tempId, ...rest }) => rest);
    onSave({ proveedor, contactos: contactosToSend });
  };

  return (
    <>
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

        {/* Nueva sección de lista de contactos */}
        <div className="form-section">
          <div className="contact-list-header">
            <h2>Contactos</h2>
            <button type="button" className="add-contact-button" onClick={handleOpenModalForCreate}>+ Añadir Contacto</button>
          </div>
          <div className="contact-list">
            {contactos.length > 0 ? (
              <table className="contact-table">
                <thead>
                  <tr>
                    <th>Nombre Completo</th>
                    <th>Cargo</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {contactos.map((contacto) => (
                    <tr key={contacto.tempId}>
                      <td data-label="Nombre">{contacto.nombreCompleto}</td>
                      <td data-label="Cargo">{contacto.cargo || 'N/A'}</td>
                      <td data-label="Teléfono">{contacto.telefono || 'N/A'}</td>
                      <td data-label="Email">{contacto.email || 'N/A'}</td>
                      <td data-label="Acciones" className="contact-actions">
                        <button type="button" onClick={() => handleOpenModalForEdit(contacto)}>Editar</button>
                        <button type="button" className="delete" onClick={() => handleDeleteContacto(contacto.tempId)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-contacts-message">No hay contactos para este proveedor. Añade uno para empezar.</p>
            )}
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

      {/* El Modal */}
      <ContactoFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveContacto}
        contacto={currentContacto}
      />
    </>
  );
}
