import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// ...otros imports

export default function GestionProductosPage() {
  const location = useLocation();
  const [highlightStock, setHighlightStock] = useState(false);

  // ...estado, fetch, modals, etc.

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('highlight') === 'stock') {
      setHighlightStock(true);
      setTimeout(() => setHighlightStock(false), 1500); // resalta por 1.5s
    }
  }, [location]);

  // ...fetch y filtros

  return (
    <div className="product-management-page">
      {/* Header y filtros */}
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
      {/* Modals */}
    </div>
  );
}
