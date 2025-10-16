import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import api from '../../api/apiClient';
import '../../styles/CrearProductoModal.css'; // Reutilizamos los estilos

Modal.setAppElement('#root');

export default function EditarProductoModal({ isOpen, onClose, onProductoActualizado, producto }) {
  const [formData, setFormData] = useState({});
  const [initialData, setInitialData] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchCategorias = async () => {
        try {
          const res = await api.get('/categoria');
          setCategorias(res.data);
        } catch (err) {
          setError('No se pudieron cargar las categorías.');
        }
      };
      fetchCategorias();

      if (producto) {
        const initial = {
          sku: producto.sku || '',
          nombre: producto.nombre || '',
          descripcion: producto.descripcion || '',
          ultimoCosto: producto.ultimoCosto || 0,
          precioMinorista: producto.precioMinorista || 0,
          precioMayorista: producto.precioMayorista || 0,
          stockMinimo: producto.stockMinimo || 0,
          stockActual: producto.stockActual || 0,
          unidadMedida: producto.unidadMedida || '',
          categoriaId: producto.categoriaId || '',
        };
        setFormData(initial);
        setInitialData(initial);
      }
    }
  }, [isOpen, producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const changedData = {};
    for (const key in formData) {
      if (formData[key] !== initialData[key]) {
        changedData[key] = formData[key];
      }
    }

    if (Object.keys(changedData).length === 0) {
      setError("No se ha realizado ningún cambio.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await api.patch(`/productos/${producto.productoId}`, changedData);
      setIsSaving(false);
      onProductoActualizado();
    } catch (err) {
      setError('Error al actualizar el producto.');
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setInitialData({});
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Editar Producto"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Editar Producto</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
            <div className="form-group">
                <label>SKU</label>
                <input type="text" name="sku" value={formData.sku || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Nombre</label>
                <input type="text" name="nombre" value={formData.nombre || ''} onChange={handleChange} required />
            </div>
            <div className="form-group full-width">
                <label>Descripción</label>
                <textarea name="descripcion" value={formData.descripcion || ''} onChange={handleChange}></textarea>
            </div>
            <div className="form-group">
                <label>Último Costo</label>
                <p>{formData.ultimoCosto || 0}</p>
            </div>
            <div className="form-group">
                <label>Precio Minorista</label>
                <input type="number" name="precioMinorista" value={formData.precioMinorista || 0} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Precio Mayorista</label>
                <input type="number" name="precioMayorista" value={formData.precioMayorista || 0} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Stock Mínimo</label>
                <input type="number" name="stockMinimo" value={formData.stockMinimo || 0} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Stock Actual</label>
                <p>{formData.stockActual || 0}</p>
            </div>
            <div className="form-group">
                <label>Unidad de Medida</label>
                <input type="text" name="unidadMedida" value={formData.unidadMedida || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Categoría</label>
                <select name="categoriaId" value={formData.categoriaId || ''} onChange={handleChange} required>
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(cat => (
                        <option key={cat.categoriaId} value={cat.categoriaId}>{cat.nombre}</option>
                    ))}
                </select>
            </div>
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
