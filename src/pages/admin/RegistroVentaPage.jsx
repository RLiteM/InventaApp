import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import api from '../../api/apiClient';
import '../../styles/RegistroVenta.css'; // Se necesitará crear este archivo de estilos

export default function RegistroVentaPage() {
  const navigate = useNavigate();

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
        setError('No se pudieron cargar los clientes.');
      }
    };
    cargarClientes();
  }, []);

  // TODO: Implementar la búsqueda de lotes cuando la API esté disponible
  const buscarLotes = async (inputValue) => {
    console.log("Buscando lotes con:", inputValue);
    // Placeholder: Reemplazar con la llamada real a la API
    // La API debería devolver algo como: [{ loteId, productoNombre, stockDisponible, precioSugerido }]
    return Promise.resolve([
      { value: 1, label: 'Lote de Coca-Cola (Stock: 50)', loteId: 1, precioUnitarioVenta: 15.00, cantidad: 1 },
      { value: 2, label: 'Lote de Pepsi (Stock: 30)', loteId: 2, precioUnitarioVenta: 14.50, cantidad: 1 },
    ]);
  };

  const handleLoteSeleccionado = (option) => {
    if (!option) return;
    const loteExistente = detallesVenta.find(d => d.loteId === option.loteId);

    if (loteExistente) {
      // Opcional: podrías mostrar una notificación o simplemente no hacer nada
      return;
    }

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
    if (!cliente || detallesVenta.length === 0) {
      setError('Debe seleccionar un cliente y al menos un producto.');
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
        usuarioId: userData.usuarioId,
        clienteId: cliente.value,
        fechaVenta: new Date(fechaVenta).toISOString(),
        montoTotal: parseFloat(calcularTotal()),
        metodoPago: metodoPago.value,
        detalles: detallesVenta.map(d => ({
          loteId: d.loteId,
          cantidad: d.cantidad,
          precioUnitarioVenta: d.precioUnitarioVenta,
        })),
      };

      // TODO: Usar el endpoint correcto, por ejemplo /ventas
      await api.post('/ventas', payload);
      navigate('/admin/dashboard'); // O a una página de confirmación/listado de ventas
    } catch (err) {
      setError('Error al registrar la venta. Verifique todos los campos.');
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="registro-venta-container">
      <h1>Registrar Nueva Venta</h1>
      {error && <div className="error-message">{error}</div>}

      {/* Sección de cabecera */}
      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label>Cliente</label>
            {cliente ? (
              <div className="cliente-seleccionado-info">
                <p><strong>Nombre:</strong> {cliente.nombreCompleto}</p>
                <p><strong>ID Fiscal:</strong> {cliente.identificacionFiscal}</p>
                <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                <p><strong>Dirección:</strong> {cliente.direccion}</p>
                <button type="button" onClick={() => setCliente(null)} className="change-client-btn">Cambiar Cliente</button>
              </div>
            ) : (
              <Select
                options={clientesOptions}
                onChange={setCliente}
                placeholder="Seleccione un cliente"
                classNamePrefix="react-select"
              />
            )}
          </div>
          <div className="form-group">
            <label>Fecha Venta</label>
            <input type="datetime-local" value={fechaVenta} onChange={e => setFechaVenta(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Método de Pago</label>
            <Select
              options={metodosPagoOptions}
              value={metodoPago}
              onChange={setMetodoPago}
              classNamePrefix="react-select"
            />
          </div>
        </div>
      </div>

      {/* Sección de búsqueda de productos */}
      <div className="form-section">
        <div className="form-group product-search">
            <label>Buscar Producto por Lote</label>
            <AsyncSelect
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

      {/* Sección de detalles de la venta */}
      <div className="form-section details-section">
        {detallesVenta.map((detalle, index) => (
          <div className="product-detail-row" key={index}>
            <span className="product-name">{detalle.label}</span>
            <input
              type="number"
              placeholder="Cantidad"
              value={detalle.cantidad}
              onChange={e => handleDetalleChange(index, 'cantidad', e.target.value)}
              required min="1"
            />
            <input
              type="number"
              placeholder="Precio Unitario"
              value={detalle.precioUnitarioVenta}
              onChange={e => handleDetalleChange(index, 'precioUnitarioVenta', e.target.value)}
              required min="0" step="0.01"
            />
            <button type="button" className="remove-product-btn" onClick={() => handleEliminarDetalle(index)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {/* Sección de pie de página */}
      <div className="form-section footer-section">
        <div className="total-display">
          Total: <span>Q{calcularTotal()}</span>
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/admin/dashboard')} disabled={isSaving}>
            Cancelar
          </button>
          <button type="submit" className="save-btn" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Venta'}
          </button>
        </div>
      </div>
    </div>
  );
}
