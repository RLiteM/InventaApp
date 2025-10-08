import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/UsuarioForm.css'; // Reutilizando estilos existentes

export default function ClienteForm({ initialData, onSave, isSaving }) {
  const [cliente, setCliente] = useState({
    nombreCompleto: '', // Corregido: de nombre a nombreCompleto
    identificacionFiscal: '',
    direccion: '',
    telefono: '',
    tipoCliente: 'Minorista' // Valor por defecto
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setCliente({
        // El GET puede devolver 'nombre', pero el estado interno usa 'nombreCompleto'
        nombreCompleto: initialData.nombre || initialData.nombreCompleto || '',
        identificacionFiscal: initialData.identificacionFiscal || '',
        direccion: initialData.direccion || '',
        telefono: initialData.telefono || '',
        tipoCliente: initialData.tipoCliente || 'Minorista'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(cliente);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-section">
        <h2>Datos del Cliente</h2>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Nombre Completo</label>
            {/* Corregido: name="nombreCompleto" y value={cliente.nombreCompleto} */}
            <input type="text" name="nombreCompleto" value={cliente.nombreCompleto} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Identificación Fiscal (NIT/CUI)</label>
            <input type="text" name="identificacionFiscal" value={cliente.identificacionFiscal} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input type="text" name="telefono" value={cliente.telefono} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Tipo de Cliente</label>
            <select name="tipoCliente" value={cliente.tipoCliente} onChange={handleChange}>
              <option value="Minorista">Minorista</option>
              <option value="Mayorista">Mayorista</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label>Dirección</label>
            <input type="text" name="direccion" value={cliente.direccion} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={() => navigate('/admin/clientes')} disabled={isSaving}>
          Cancelar
        </button>
        <button type="submit" className="save-button" disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar Cliente'}
        </button>
      </div>
    </form>
  );
}
