
import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { getProductos, getLotes, createAjusteInventario } from '../../api/inventarioApi';
import { ThemeContext } from '../../context/ThemeProvider';
import { getSelectStyles } from '../../styles/selectStyles';
import '../../styles/AjusteInventario.css';

const AjusteInventarioForm = ({ user }) => {
  const { theme } = useContext(ThemeContext);
  const [motivoAjuste, setMotivoAjuste] = useState('');
  const [tipoAjuste, setTipoAjuste] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [productoId, setProductoId] = useState(null);
  const [loteId, setLoteId] = useState(null);
  const [productos, setProductos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dañoPor, setDañoPor] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosRes, lotesRes] = await Promise.all([
          getProductos(),
          getLotes(),
        ]);
        setProductos(productosRes.map(p => ({ value: p.productoId, label: p.nombre })));
        setLotes(lotesRes.map(l => ({ value: l.loteId, label: `${l.loteId} - ${productosRes.find(p => p.productoId === l.productoId)?.nombre}` })));
      } catch (err) {
        setError('Error al cargar datos');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (motivoAjuste === 'AJUSTE_CONTEO') {
      if (!loteId || !tipoAjuste) {
        setError('Por favor, complete todos los campos obligatorios.');
        return;
      }
    } else if (motivoAjuste === 'VENCIMIENTO') {
      if (!productoId) {
        setError('Por favor, complete todos los campos obligatorios.');
        return;
      }
    } else if (motivoAjuste === 'DAÑO') {
      if (!dañoPor || (dañoPor === 'lote' && !loteId) || (dañoPor === 'producto' && !productoId)) {
        setError('Por favor, complete todos los campos obligatorios.');
        return;
      }
    }

    const ajusteData = {
      motivoAjuste,
      cantidad: parseFloat(cantidad),
      descripcion,
      usuarioId: user.usuarioId,
    };

    if (motivoAjuste === 'AJUSTE_CONTEO') {
      ajusteData.tipoAjuste = tipoAjuste;
      if (loteId) {
        ajusteData.loteId = loteId.value;
      }
    } else if (motivoAjuste === 'VENCIMIENTO') {
      ajusteData.tipoAjuste = 'Salida';
      if (productoId) {
        ajusteData.productoId = productoId.value;
      }
    } else if (motivoAjuste === 'DAÑO') {
      ajusteData.tipoAjuste = 'Salida';
      if (dañoPor === 'lote' && loteId) {
        ajusteData.loteId = loteId.value;
      } else if (dañoPor === 'producto' && productoId) {
        ajusteData.productoId = productoId.value;
      }
    }

    try {
      await createAjusteInventario(ajusteData);
      setSuccess('Ajuste de inventario creado con éxito');
      // Reset form
      setMotivoAjuste('');
      setTipoAjuste('');
      setCantidad('');
      setDescripcion('');
      setProductoId(null);
      setLoteId(null);
      setDañoPor('');
    } catch (err) {
      setError('Error al crear el ajuste de inventario');
    }
  };

  return (
    <div className="ajuste-inventario-container">
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-section">
          <div className="form-group">
            <label>Motivo del Ajuste</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="AJUSTE_CONTEO"
                  name="motivoAjuste"
                  onChange={(e) => setMotivoAjuste(e.target.value)}
                /> Ajuste por Conteo Físico
              </label>
              <label>
                <input
                  type="radio"
                  value="VENCIMIENTO"
                  name="motivoAjuste"
                  onChange={(e) => setMotivoAjuste(e.target.value)}
                /> Baja por Vencimiento
              </label>
              <label>
                <input
                  type="radio"
                  value="DAÑO"
                  name="motivoAjuste"
                  onChange={(e) => setMotivoAjuste(e.target.value)}
                /> Baja por Daño
              </label>
            </div>
          </div>
        </div>

        {motivoAjuste === 'AJUSTE_CONTEO' && (
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label>Lote</label>
                <Select
                  styles={getSelectStyles(theme)}
                  options={lotes}
                  value={loteId}
                  onChange={setLoteId}
                  placeholder="Seleccione un lote"
                  required
                />
              </div>
              <div className="form-group">
                <label>Tipo de Ajuste</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="Entrada"
                      name="tipoAjuste"
                      onChange={(e) => setTipoAjuste(e.target.value)}
                      required
                    /> Entrada (Sobrante)
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Salida"
                      name="tipoAjuste"
                      onChange={(e) => setTipoAjuste(e.target.value)}
                      required
                    /> Salida (Faltante)
                  </label>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Cantidad</label>
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {motivoAjuste === 'VENCIMIENTO' && (
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label>Producto</label>
                <Select
                  styles={getSelectStyles(theme)}
                  options={productos}
                  value={productoId}
                  onChange={setProductoId}
                  placeholder="Seleccione un producto"
                  required
                />
              </div>
              <div className="form-group">
                <label>Cantidad</label>
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {motivoAjuste === 'DAÑO' && (
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label>Registrar Daño por</label>
                <Select
                  styles={getSelectStyles(theme)}
                  options={[{ value: 'lote', label: 'Lote Específico' }, { value: 'producto', label: 'Producto (se dará de baja del lote más antiguo)' }]}
                  onChange={(option) => {
                    setDañoPor(option.value);
                    setLoteId(null);
                    setProductoId(null);
                  }}
                  placeholder="Seleccione una opción"
                />
              </div>
            </div>
            {dañoPor === 'lote' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Lote</label>
                  <Select
                    styles={getSelectStyles(theme)}
                    options={lotes}
                    value={loteId}
                    onChange={setLoteId}
                    placeholder="Seleccione un lote"
                    required
                  />
                </div>
              </div>
            )}
            {dañoPor === 'producto' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Producto</label>
                  <Select
                    styles={getSelectStyles(theme)}
                    options={productos}
                    value={productoId}
                    onChange={setProductoId}
                    placeholder="Seleccione un producto"
                    required
                  />
                </div>
              </div>
            )}
            {(dañoPor === 'lote' || dañoPor === 'producto') && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Cantidad</label>
                    <input
                      type="number"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary ajuste-inventario-btn">Crear Ajuste</button>
        </div>
      </form>
    </div>
  );
};

export default AjusteInventarioForm;
