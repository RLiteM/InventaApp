import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import api from '../../api/apiClient';
import '../../styles/GestionProductos.css';
import CrearProductoModal from '../../components/admin/CrearProductoModal';
import EditarProductoModal from '../../components/admin/EditarProductoModal';

export default function GestionProductosPage() {
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [highlightStock, setHighlightStock] = useState(false);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [productosRes, categoriasRes] = await Promise.all([
        api.get('/productos'),
        api.get('/categoria')
      ]);

      setProductos(Array.isArray(productosRes.data) ? productosRes.data : []);
      setCategorias(Array.isArray(categoriasRes.data) ? categoriasRes.data : []);

    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('No se pudo cargar la lista de productos o categorías.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Detectar si venimos del KPI de Stock Total
  useEffect(() => {
    if (location.state?.highlightStock) {
      setHighlightStock(true);
      const timer = setTimeout(() => setHighlightStock(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleProductoCreado = () => {
    setIsModalOpen(false);
    fetchInitialData();
  };

  const handleProductoActualizado = () => {
    setIsEditModalOpen(false);
    fetchInitialData();
  };

  const handleEditClick = (producto) => {
    setProductoAEditar(producto);
    setIsEditModalOpen(true);
  };

  const productosFiltrados = productos.filter(prod => {
    const terminoBusqueda = filtro.toLowerCase();
    const categoriaMatch = !filtroCategoria || prod.categoriaId.toString() === filtroCategoria;
    const busquedaMatch = !terminoBusqueda ||
      prod.sku.toLowerCase().includes(terminoBusqueda) ||
      prod.nombre.toLowerCase().includes(terminoBusqueda);
    return categoriaMatch && busquedaMatch;
  });

  if (isLoading && !productos.length) return <div>Cargando productos...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="product-management-page">
      <div className="page-header">
        <h1>Gestión de Productos</h1>
        <button onClick={() => setIsModalOpen(true)} className="create-button"><FiPlus /> Crear Producto</button>
      </div>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Buscar por SKU o Nombre..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="filter-input"
        />
        <select
          className="filter-select"
          value={filtroCategoria}
          onChange={e => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.categoriaId} value={cat.categoriaId}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      <div className="table-responsive-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nombre</th>
              <th className="col-descripcion">Descripción</th>
              <th>Costo</th>
              <th>Minorista</th>
              <th>Mayorista</th>
              <th>Stock</th>
              <th>Stock Mín.</th>
              <th>Medida</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map(prod => (
              <tr key={prod.productoId}>
                <td>{prod.sku}</td>
                <td>{prod.nombre}</td>
                <td className="col-descripcion">{prod.descripcion}</td>
                <td>{prod.ultimoCosto}</td>
                <td>{prod.precioMinorista}</td>
                <td>{prod.precioMayorista}</td>
                <td className={`${highlightStock ? 'highlight-stock' : ''} ${prod.stockActual <= prod.stockMinimo ? 'stock-bajo' : ''}`}>
                  {prod.stockActual}
                </td>
                <td>{prod.stockMinimo}</td>
                <td>{prod.unidadMedida}</td>
                <td className="action-buttons">
                  <button title="Editar" onClick={() => handleEditClick(prod)} className="edit-button action-btn-icon"><FiEdit /></button>
                  <button title="Eliminar" onClick={() => alert('Funcionalidad no implementada')} className="delete-button action-btn-icon"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CrearProductoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onProductoCreado={handleProductoCreado} />
      {productoAEditar && <EditarProductoModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onProductoActualizado={handleProductoActualizado} producto={productoAEditar} />}
    </div>
  );
}
