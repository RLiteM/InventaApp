import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FiPlus, FiTrash2, FiXCircle, FiSave } from 'react-icons/fi';
import api from '../../api/apiClient';
import '../../styles/RegistroCompra.css';
import CrearProductoModal from '../../components/admin/CrearProductoModal';

export default function RegistroCompraPage() {
  const navigate = useNavigate();

  // Estados del formulario
  const [proveedor, setProveedor] = useState(null);
  const [fechaCompra, setFechaCompra] = useState(new Date().toISOString().split('T')[0]);
  const [numeroFactura, setNumeroFactura] = useState('');
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  
  // Datos de la API
  const [proveedoresOptions, setProveedoresOptions] = useState([]);
  const [productosOptions, setProductosOptions] = useState([]);

  // Estados de UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos iniciales
  const cargarDatos = async () => {
    try {
      const [proveedoresRes, productosRes] = await Promise.all([
        api.get('/proveedores'),
        api.get('/productos/nombre-sku') // Usar el endpoint que devuelve el DTO
      ]);
      
      setProveedoresOptions(proveedoresRes.data.map(p => ({ value: p.id, label: p.nombreEmpresa })));
      
      // Mapear la respuesta del DTO para el Select
      setProductosOptions(productosRes.data.map(p => ({
        value: p.productoId,
        label: `${p.nombre} (${p.sku})`,
        nombre: p.nombre // Guardar el nombre original para usarlo al seleccionar
      })));

    } catch (err) {
      setError('No se pudieron cargar los datos iniciales.');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleProductoSeleccionado = (option) => {
    if (!option) return;
    const productoExistente = productosSeleccionados.find(p => p.productoId === option.value);

    if (productoExistente) {
      return;
    }

    const nuevoProducto = {
      productoId: option.value,
      nombre: option.nombre, // Usar el nombre guardado en el mapeo
      fechaCaducidad: '',
      costoUnitarioCompra: '',
      cantidad: 1,
    };
    setProductosSeleccionados([...productosSeleccionados, nuevoProducto]);
  };

  const handleDetalleChange = (index, field, value) => {
    const nuevosDetalles = [...productosSeleccionados];
    nuevosDetalles[index][field] = value;
    setProductosSeleccionados(nuevosDetalles);
  };

  const handleEliminarProducto = (index) => {
    setProductosSeleccionados(productosSeleccionados.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return productosSeleccionados.reduce((total, p) => {
      const costo = parseFloat(p.costoUnitarioCompra) || 0;
      const cantidad = parseInt(p.cantidad, 10) || 0;
      return total + (costo * cantidad);
    }, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proveedor || productosSeleccionados.length === 0) {
      setError('Debe seleccionar un proveedor y al menos un producto.');
      return;
    }
    setIsSaving(true);
    setError(null);

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.usuarioId) {
        throw new Error('No se encontró el ID del usuario.');
      }

      const payload = {
        proveedorId: proveedor.value,
        fechaCompra,
        numeroFactura,
        usuarioId: userData.usuarioId,
        detalles: productosSeleccionados.map(p => ({
          productoId: p.productoId,
          cantidad: parseInt(p.cantidad, 10),
          costoUnitarioCompra: parseFloat(p.costoUnitarioCompra),
          fechaCaducidad: p.fechaCaducidad,
        })),
      };

      await api.post('/compras', payload);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Error al registrar la compra. Verifique todos los campos.');
      console.error(err);
      setIsSaving(false);
    }
  };
  
  const handleProductoCreado = () => {
    setIsModalOpen(false);
    cargarDatos(); // Recargar productos para que aparezca el nuevo
  };

  return (
    <div className="registro-compra-container">
      <h1>Registrar Nueva Compra</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="form-section header-section">
        <div className="form-row">
          <div className="form-group">
            <label>Registrar Proveedor</label>
            <Select
              options={proveedoresOptions}
              value={proveedor}
              onChange={setProveedor}
              placeholder="Buscar o seleccionar un proveedor..."
              classNamePrefix="react-select"
              isSearchable
            />
          </div>
          <div className="form-group">
            <label>Fecha Compra</label>
            <input type="date" value={fechaCompra} onChange={e => setFechaCompra(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Número Factura</label>
            <input type="text" value={numeroFactura} onChange={e => setNumeroFactura(e.target.value)} placeholder="Ej: F-001" />
          </div>
        </div>
      </div>

      <div className="form-section product-section">
        <div className="form-row">
          <div className="form-group">
            <button type="button" className="create-product-btn" onClick={() => setIsModalOpen(true)}>
              <FiPlus /> Crear Producto
            </button>
          </div>
          <div className="form-group product-search">
            <label>Buscar Producto</label>
            <Select
              options={productosOptions}
              onChange={handleProductoSeleccionado}
              placeholder="Escriba para buscar un producto..."
              value={null} // Para resetear la selección después de agregar
              classNamePrefix="react-select"
              isClearable
              isSearchable
            />
          </div>
        </div>
      </div>

      <div className="form-section details-section">
        <table className="product-table">
          <thead>
            <tr>
              <th className="product-col">Producto</th>
              <th className="date-col">Fecha Caducidad</th>
              <th className="number-col">Costo</th>
              <th className="number-col">Cantidad</th>
              <th className="action-col">Acción</th>
            </tr>
          </thead>
          <tbody>
            {productosSeleccionados.length > 0 ? (
              productosSeleccionados.map((producto, index) => (
                <tr key={index}>
                  <td data-label="Producto">{producto.nombre}</td>
                  <td data-label="Fecha Caducidad">
                    <input
                      type="date"
                      value={producto.fechaCaducidad}
                      onChange={e => handleDetalleChange(index, 'fechaCaducidad', e.target.value)}
                      required
                    />
                  </td>
                  <td data-label="Costo">
                    <input
                      type="number"
                      placeholder="Costo"
                      value={producto.costoUnitarioCompra}
                      onChange={e => handleDetalleChange(index, 'costoUnitarioCompra', e.target.value)}
                      required
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td data-label="Cantidad">
                    <input
                      type="number"
                      placeholder="Cantidad"
                      value={producto.cantidad}
                      onChange={e => handleDetalleChange(index, 'cantidad', e.target.value)}
                      required
                      min="1"
                    />
                  </td>
                  <td data-label="Acción">
                    <button type="button" className="remove-product-btn" onClick={() => handleEliminarProducto(index)}>
                      <FiTrash2 /> Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-products-message">
                  No hay productos agregados a la compra.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="form-section footer-section">
        <div className="total-display">
          Total: <span>Q{calcularTotal()}</span>
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/admin/dashboard')} disabled={isSaving}>
            <FiXCircle /> Cancelar
          </button>
          <button type="submit" className="save-btn" onClick={handleSubmit} disabled={isSaving}>
            <FiSave /> {isSaving ? 'Guardando...' : 'Guardar Compra'}
          </button>
        </div>
      </div>

      <CrearProductoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductoCreado={handleProductoCreado}
      />
    </div>
  );
}
