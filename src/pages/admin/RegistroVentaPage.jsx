
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import api from '../../api/apiClient';
import '../../styles/RegistroVenta.css';
import { ThemeContext } from '../../context/ThemeProvider'; // Importar el contexto del tema

export default function RegistroVentaPage() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext); // Obtener el tema actual

  // Estados del formulario
  const [cliente, setCliente] = useState(null);
  const [fechaVenta, setFechaVenta] = useState(new Date().toISOString().slice(0, 16));
  const [metodoPago, setMetodoPago] = useState({ value: 'EFECTIVO', label: 'Efectivo' });
  const [detallesVenta, setDetallesVenta] = useState([]);
  
  // Datos de la API
  const [clientesOptions, setClientesOptions] = useState([]);

  // Estados de UI
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const metodosPagoOptions = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TARJETA', label: 'Tarjeta' },
    { value: 'TRANSFERENCIA', label: 'Transferencia' },
  ];

  // Cargar clientes
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const res = await api.get('/clientes');
        setClientesOptions(res.data.map(c => ({
          value: c.clienteId,
          label: `${c.nombreCompleto} (ID: ${c.identificacionFiscal})`,
          ...c
        })));
      } catch (err) {
        console.error('No se pudieron cargar los clientes.', err);
      }
    };
    cargarClientes();
  }, []);

  const buscarLotes = async (inputValue) => {
    // Implementación de búsqueda de lotes
    return [];
  };

  const handleLoteSeleccionado = (option) => {
    if (!option) return;
    const loteExistente = detallesVenta.find(d => d.loteId === option.loteId);
    if (loteExistente) return;
    setDetallesVenta([...detallesVenta, { ...option }]);
  };

  const handleDetalleChange = (index, field, value) => {
    const nuevosDetalles = [...detallesVenta];
    const numericValue = parseFloat(value);
    nuevosDetalles[index][field] = isNaN(numericValue) ? 0 : numericValue;
    setDetallesVenta(nuevosDetalles);
  };

  const handleEliminarDetalle = (index) => {
    setDetallesVenta(detallesVenta.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return detallesVenta.reduce((total, d) => {
      const precio = d.precioUnitarioVenta || 0;
      const cantidad = d.cantidad || 0;
      return total + (precio * cantidad);
    }, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica de guardado
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
    <div className="registro-venta-container">
      <h1>Registrar Nueva Venta</h1>

      <div className="cliente-header-section">
        <div className="cliente-header-title">Cliente</div>
        <div className="cliente-header-content">
          {cliente ? (
            <div className="cliente-info-display">
              <div className="info-item"><strong>Nombre:</strong><span>{cliente.nombreCompleto}</span></div>
              <div className="info-item"><strong>ID Fiscal:</strong><span>{cliente.identificacionFiscal}</span></div>
              <div className="info-item"><strong>Teléfono:</strong><span>{cliente.telefono}</span></div>
              <button type="button" onClick={() => setCliente(null)} className="change-client-btn">Cambiar</button>
            </div>
          ) : (
            <Select
              styles={getSelectStyles(theme)}
              options={clientesOptions}
              onChange={setCliente}
              placeholder="Busque y seleccione un cliente..."
              classNamePrefix="react-select"
              className="cliente-select"
              isClearable
            />
          )}
        </div>
      </div>

      <h2>Detalles de la Venta</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label>Fecha Venta</label>
            <input type="datetime-local" value={fechaVenta} onChange={e => setFechaVenta(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Método de Pago</label>
            <Select
              styles={getSelectStyles(theme)}
              options={metodosPagoOptions}
              value={metodoPago}
              onChange={setMetodoPago}
              classNamePrefix="react-select"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-group product-search">
            <label>Buscar Producto por Lote</label>
            <AsyncSelect
              styles={getSelectStyles(theme)}
              cacheOptions
              loadOptions={buscarLotes}
              onChange={handleLoteSeleccionado}
              placeholder="Escriba para buscar un lote..."
              value={null}
              classNamePrefix="react-select"
              loadingMessage={() => "Buscando..."}
              noOptionsMessage={() => "No se encontraron lotes"}
            />
        </div>
      </div>

      {/* ... resto del JSX ... */}
    </div>
  );
}

