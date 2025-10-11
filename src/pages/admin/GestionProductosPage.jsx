import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import api from '../../api/apiClient';
import '../../styles/GestionProductos.css';

export default function GestionProductosPage() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/productos');
      console.log('Respuesta de la API (response.data):', response.data);
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        setProductos(responseData);
      } else if (responseData && Array.isArray(responseData.productos)) {
        setProductos(responseData.productos);
      } else if (responseData && Array.isArray(responseData.data)) {
        setProductos(responseData.data);
      } else {
        setProductos([]);
        console.error("La respuesta de la API no es un array como se esperaba: ", responseData);
        setError('El formato de los datos recibidos no es el esperado.');
      }
    } catch (err) {
      console.error('Error detallado al obtener productos:', err);
      setError('No se pudo cargar la lista de productos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  if (isLoading && !productos.length) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="product-management-page">
      <div className="page-header">
        <h1>Gestión de Productos</h1>
        <button onClick={() => alert('Funcionalidad no implementada')} className="create-button"><FiPlus /> Crear Producto</button>
      </div>
      <table className="products-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio Minorista</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(prod => (
            <tr key={prod.productoId}>
              <td>{prod.sku}</td>
              <td>{prod.nombre}</td>
              <td>{prod.descripcion}</td>
              <td>{prod.precioMinorista}</td>
              <td>{prod.stockActual}</td>
              <td>{prod.categoriaNombre}</td>
              <td className="action-buttons">
                <button onClick={() => alert('Funcionalidad no implementada')} className="edit-button"><FiEdit /> Editar</button>
                <button onClick={() => alert('Funcionalidad no implementada')} className="delete-button"><FiTrash2 /> Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
