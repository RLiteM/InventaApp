import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import api from '../../api/apiClient';
import '../../styles/UsuarioForm.css'; // Reutilizamos estilos
import '../../styles/RegistroCompra.css';

export default function RegistroCompraPage() {
  const navigate = useNavigate();
  // Estados del formulario
  const [header, setHeader] = useState({ proveedorId: '', fechaCompra: new Date().toISOString().split('T')[0], numeroFactura: '' });
  const [details, setDetails] = useState([ { productoId: '', cantidad: 1, costoUnitarioCompra: '', fechaCaducidad: '' } ]);
  // Datos de la API
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  // Estados de UI
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Cargar proveedores y productos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, productsRes] = await Promise.all([
          api.get('/proveedores'),
          api.get('/productos')
        ]);
        setSuppliers(suppliersRes.data);
        // Formatear productos para react-select
        const productOptions = productsRes.data.map(p => ({ value: p.id, label: p.nombre }));
        setProducts(productOptions);
      } catch (err) {
        setError('No se pudieron cargar los proveedores o productos.');
      }
    };
    fetchData();
  }, []);

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeader(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  const addDetailRow = () => {
    setDetails([...details, { productoId: '', cantidad: 1, costoUnitarioCompra: '', fechaCaducidad: '' }]);
  };

  const removeDetailRow = (index) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.id) {
        throw new Error('No se encontró el ID del usuario.');
      }

      const payload = {
        ...header,
        usuarioId: userData.usuarioId,
        detalles: details.map(d => ({ ...d, productoId: d.productoId.value })), // Extraer el value del select
      };

      await api.post('/compras', payload);
      navigate('/dashboard'); // O a una página de listado de compras

    } catch (err) {
      setError('Error al registrar la compra. Verifique todos los campos.');
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="purchase-form-page">
      <h1>Registrar Nueva Compra</h1>
      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit} className="purchase-form-container">
        
        <div className="form-section">
          <h2>Cabecera de la Compra</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Proveedor</label>
              <select name="proveedorId" value={header.proveedorId} onChange={handleHeaderChange} required>
                <option value="">Seleccione un proveedor</option>
                {suppliers.filter(s => s.id).map(s => <option key={s.id} value={s.id}>{s.nombreEmpresa}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Fecha de Compra</label>
              <input type="date" name="fechaCompra" value={header.fechaCompra} onChange={handleHeaderChange} required />
            </div>
            <div className="form-group">
              <label>Número de Factura</label>
              <input type="text" name="numeroFactura" value={header.numeroFactura} onChange={handleHeaderChange} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Detalles de la Compra</h2>
          <table className="details-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Costo Unitario</th>
                <th>Fecha Caducidad</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => (
                <tr key={index}>
                  <td className='react-select-container'>
                    <Select options={products} value={detail.productoId} onChange={val => handleDetailChange(index, 'productoId', val)} required />
                  </td>
                  <td><input type="number" value={detail.cantidad} onChange={e => handleDetailChange(index, 'cantidad', e.target.value)} required min="1" /></td>
                  <td><input type="number" step="0.01" value={detail.costoUnitarioCompra} onChange={e => handleDetailChange(index, 'costoUnitarioCompra', e.target.value)} required min="0" /></td>
                  <td><input type="date" value={detail.fechaCaducidad} onChange={e => handleDetailChange(index, 'fechaCaducidad', e.target.value)} required /></td>
                  <td><button type="button" className="remove-row-button" onClick={() => removeDetailRow(index)}>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="add-row-button" onClick={addDetailRow}>+ Añadir Producto</button>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => navigate('/dashboard')} disabled={isSaving}>Cancelar</button>
          <button type="submit" className="save-button" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Registrar Compra'}</button>
        </div>
      </form>
    </div>
  );
}
