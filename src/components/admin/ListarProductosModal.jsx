import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import api from '../../api/apiClient';
import '../../styles/ListarProductosModal.css';

Modal.setAppElement('#root');

export default function ListarProductosModal({ isOpen, onClose, categoria }) {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && categoria) {
      const fetchProductos = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await api.get(`/categoria/${categoria.categoriaId}/productos`);
          setProductos(response.data);
        } catch (err) {
          setError(`No se pudieron cargar los productos para la categoría "${categoria.nombre}".`);
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProductos();
    }
  }, [isOpen, categoria]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Productos de la Categoría"
      className="list-modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Productos en {categoria?.nombre}</h2>
      <div className="modal-body">
        {isLoading && <div>Cargando productos...</div>}
        {error && <div className="error-message">{error}</div>}
        {!isLoading && !error && (
          <table className="productos-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Nombre</th>
                <th>Stock</th>
                <th>Stock Mín.</th>
                <th>Unidad</th>
                <th>Costo</th>
                <th>P. Minorista</th>
                <th>P. Mayorista</th>
              </tr>
            </thead>
            <tbody>
              {productos.length > 0 ? (
                productos.map(producto => (
                  <tr key={producto.productoId}>
                    <td>{producto.sku || 'N/A'}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.stockActual}</td>
                    <td>{producto.stockMinimo}</td>
                    <td>{producto.unidadMedida}</td>
                    <td>Q{parseFloat(producto.ultimoCosto || 0).toFixed(2)}</td>
                    <td>Q{parseFloat(producto.precioMinorista || 0).toFixed(2)}</td>
                    <td>Q{parseFloat(producto.precioMayorista || 0).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No hay productos en esta categoría.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className="modal-footer">
        <button onClick={onClose} className="close-btn">Cerrar</button>
      </div>
    </Modal>
  );
}
