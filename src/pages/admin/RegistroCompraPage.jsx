
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FiPlus, FiTrash2, FiXCircle, FiSave } from 'react-icons/fi';
import api from '../../api/apiClient';
import '../../styles/RegistroCompra.css';
import CrearProductoModal from '../../components/admin/CrearProductoModal';
import { ThemeContext } from '../../context/ThemeProvider'; // Importar el contexto del tema

export default function RegistroCompraPage() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext); // Obtener el tema actual

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
  const [successMessage, setSuccessMessage] = useState(null);

  // Cargar datos iniciales
  const cargarDatos = async () => {
    try {
      const [proveedoresRes, productosRes] = await Promise.all([
        api.get('/proveedores'),
        api.get('/productos/nombre-sku')
      ]);
      
      setProveedoresOptions(proveedoresRes.data.map(p => ({ value: p.proveedorId, label: p.nombreEmpresa })));
      
      setProductosOptions(productosRes.data.map(p => ({
        value: p.productoId,
        label: `${p.nombre} (${p.sku})`,
        nombre: p.nombre
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

    if (productoExistente) return;

    const nuevoProducto = {
      productoId: option.value,
      nombre: option.nombre,
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
      const cantidad = parseFloat(p.cantidad) || 0;
      return total + (costo * cantidad);
    }, 0).toFixed(2);
  };

  const resetForm = () => {
    setProveedor(null);
    setFechaCompra(new Date().toISOString().split('T')[0]);
    setNumeroFactura('');
    setProductosSeleccionados([]);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!proveedor || productosSeleccionados.length === 0) {
      setError('Debe seleccionar un proveedor y al menos un producto.');
      return;
    }

    // Validación de detalles de productos
    for (const p of productosSeleccionados) {
      const cantidad = parseFloat(p.cantidad);
      const costo = parseFloat(p.costoUnitarioCompra);

      if (!p.fechaCaducidad || !p.costoUnitarioCompra || !p.cantidad) {
        setError('Por favor, complete todos los campos para cada producto (fecha de caducidad, costo y cantidad).');
        return;
      }
      if (isNaN(cantidad) || isNaN(costo)) {
        setError('El costo y la cantidad deben ser números válidos.');
        return;
      }
      if (costo <= 0 || cantidad <= 0) {
        setError('El costo y la cantidad de los productos deben ser mayores a cero.');
        return;
      }
    }

    setIsSaving(true);

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
          cantidad: parseFloat(p.cantidad),
          costoUnitarioCompra: parseFloat(p.costoUnitarioCompra),
          fechaCaducidad: p.fechaCaducidad,
        })),
      };

      const response = await api.post('/compras', payload);
      setSuccessMessage(`¡Compra registrada con éxito! ID de Compra: ${response.data.compraId}, Monto Total: Q${response.data.montoTotal}`);
      
      // Resetear formulario para nueva compra
      setProveedor(null);
      setNumeroFactura('');
      setProductosSeleccionados([]);

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al registrar la compra. Verifique todos los campos.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleProductoCreado = () => {
    setIsModalOpen(false);
    cargarDatos();
  };

  // Estilos para react-select adaptables al tema
  const getSelectStyles = (theme) => {
    const isDark = theme === 'dark';
    return {
      control: (provided, state) => ({
        ...provided,
        backgroundColor: isDark ? '#1a2e2b' : '#ffffff',
        borderColor: state.isFocused ? (isDark ? '#00796b' : '#00695c') : (isDark ? '#004d40' : '#ccece6'),
        color: isDark ? 'rgba(255, 255, 255, 0.87)' : '#0d1c1a',
        boxShadow: state.isFocused ? `0 0 0 1px ${isDark ? '#00796b' : '#00695c'}` : 'none',
        '&:hover': {
          borderColor: isDark ? '#00796b' : '#00695c',
        },
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: isDark ? '#1a2e2b' : '#ffffff',
        zIndex: 100,
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? (isDark ? '#00796b' : '#00695c') : state.isFocused ? (isDark ? '#2a3f3c' : '#e6f6f3') : (isDark ? '#1a2e2b' : '#ffffff'),
        color: state.isSelected ? '#ffffff' : (isDark ? 'rgba(255, 255, 255, 0.87)' : '#0d1c1a'),
        '&:active': {
          backgroundColor: isDark ? '#00796b' : '#00695c',
        },
      }),
      singleValue: (provided) => ({
        ...provided,
        color: isDark ? 'rgba(255, 255, 255, 0.87)' : '#0d1c1a',
      }),
      input: (provided) => ({
        ...provided,
        color: isDark ? 'rgba(255, 255, 255, 0.87)' : '#0d1c1a',
      }),
      placeholder: (provided) => ({
        ...provided,
        color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
      }),
    };
  };

  return (
    <div className="registro-compra-container">
      <h1>Registrar Nueva Compra</h1>

      {successMessage ? (
        <div className="success-message">
          <p>{successMessage}</p>
          <button onClick={resetForm} className="save-btn">
            <FiPlus /> Registrar Otra Compra
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-section header-section">
            <div className="form-row">
              <div className="form-group">
                <label>Registrar Proveedor</label>
                <Select
                  styles={getSelectStyles(theme)}
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
                  styles={getSelectStyles(theme)}
                  options={productosOptions}
                  onChange={handleProductoSeleccionado}
                  placeholder="Escriba para buscar un producto..."
                  value={null}
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
              <button type="submit" className="save-btn" disabled={isSaving}>
                <FiSave /> {isSaving ? 'Guardando...' : 'Guardar Compra'}
              </button>
            </div>
          </div>
        </form>
      )}

      <CrearProductoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductoCreado={handleProductoCreado}
      />
    </div>
  );
}

