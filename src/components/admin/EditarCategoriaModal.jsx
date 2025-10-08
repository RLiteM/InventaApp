import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import api from '../../api/apiClient';
import '../../styles/CrearCategoriaModal.css'; // Reutilizamos los estilos

Modal.setAppElement('#root');

export default function EditarCategoriaModal({ isOpen, onClose, onCategoriaActualizada, categoria }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Cargar datos de la categoría cuando el modal se abre o la categoría cambia
    if (categoria) {
      setNombre(categoria.nombre || '');
      setDescripcion(categoria.descripcion || '');
    }
  }, [categoria]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre) {
      setError('El nombre de la categoría es obligatorio.');
      return;
    }
    setIsSaving(true);
    setError(null);

    try {
      await api.put(`/categoria/${categoria.categoriaId}`, { nombre, descripcion });
      setIsSaving(false);
      onCategoriaActualizada(); // Notificar al padre para que cierre y recargue
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al actualizar la categoría. Inténtelo de nuevo.');
      }
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Editar Categoría"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Editar Categoría</h2>
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
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
