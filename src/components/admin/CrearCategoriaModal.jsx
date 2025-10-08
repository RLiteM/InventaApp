import { useState } from 'react';
import Modal from 'react-modal';
import api from '../../api/apiClient';
import '../../styles/CrearCategoriaModal.css';

// Asignar el modal al elemento raíz de la aplicación para accesibilidad
Modal.setAppElement('#root');

export default function CrearCategoriaModal({ isOpen, onClose, onCategoriaCreada }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre) {
      setError('El nombre de la categoría es obligatorio.');
      return;
    }
    setIsSaving(true);
    setError(null);

    try {
      await api.post('/categoria', { nombre, descripcion });
      setIsSaving(false);
      // Resetear el formulario y notificar al componente padre
      setNombre('');
      setDescripcion('');
      onCategoriaCreada();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al crear la categoría. Inténtelo de nuevo.');
      }
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Resetear estado al cerrar
    setNombre('');
    setDescripcion('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Crear Nueva Categoría"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Crear Nueva Categoría</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de la Categoría</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Lácteos"
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción (Opcional)</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Productos derivados de la leche"
          />
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleClose} disabled={isSaving}>
            Cancelar
          </button>
          <button type="submit" className="save-btn" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Crear Categoría'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
