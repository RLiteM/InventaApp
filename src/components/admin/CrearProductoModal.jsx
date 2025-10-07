import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import api from '../../api/apiClient';
import '../../styles/CrearProductoModal.css'; // Crearemos este archivo de estilos

// Asignar el modal al elemento raíz de la aplicación para accesibilidad
Modal.setAppElement('#root');

export default function CrearProductoModal({ isOpen, onClose, onProductoCreado }) {
  const [nombre, setNombre] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Cargar categorías cuando el modal se abre
      const fetchCategorias = async () => {
        try {
          const res = await api.get('/categorias');
          setCategorias(res.data);
        } catch (err) {
          setError('No se pudieron cargar las categorías.');
        }
      };
      fetchCategorias();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !categoriaId) {
      setError('El nombre y la categoría son obligatorios.');
      return;
    }
    setIsSaving(true);
    setError(null);

    try {
      await api.post('/productos', { nombre, categoriaId });
      setIsSaving(false);
      setNombre('');
      setCategoriaId('');
      onProductoCreado(); // Llama a la función para cerrar y recargar
    } catch (err) {
      setError('Error al crear el producto.');
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Resetear estado al cerrar
    setNombre('');
    setCategoriaId('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Crear Nuevo Producto"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Crear Nuevo Producto</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Producto</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Leche Entera 1L"
            required
          />
        </div>
        <div className="form-group">
          <label>Categoría</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleClose} disabled={isSaving}>
            Cancelar
          </button>
          <button type="submit" className="save-btn" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
