import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/apiClient';
import '../../styles/UsuarioForm.css';

export default function UsuarioForm({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    cuiDpi: '',
    nombreUsuario: '',
    contrasena: '',
    rolId: '',
    correo: '',
    telefono: '',
  });
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  // Cargar roles desde la API
  useEffect(() => {
    api.get('/roles')
      .then(response => setRoles(response.data))
      .catch(err => console.error("Failed to fetch roles", err));
  }, []);

  // Poblar el formulario si es para editar
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombreCompleto: initialData.nombreCompleto || '',
        cuiDpi: initialData.cuiDpi || '',
        nombreUsuario: initialData.nombreUsuario || '',
        contrasena: '', // La contraseña no se precarga por seguridad
        rolId: initialData.rolId || '',
        correo: initialData.correo || '',
        telefono: initialData.telefono || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSend = { ...formData };

    // No enviar la contraseña si está vacía (caso de edición)
    if (!dataToSend.contrasena) {
      delete dataToSend.contrasena;
    }

    onSave(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="nombreCompleto">Nombre Completo</label>
          <input type="text" id="nombreCompleto" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="nombreUsuario">Nombre de Usuario</label>
          <input type="text" id="nombreUsuario" name="nombreUsuario" value={formData.nombreUsuario} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="cuiDpi">CUI/DPI</label>
          <input type="text" id="cuiDpi" name="cuiDpi" value={formData.cuiDpi} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="contrasena">Contraseña</label>
          <input type="password" id="contrasena" name="contrasena" value={formData.contrasena} onChange={handleChange} required={!initialData} />
          {!initialData && <small>Requerida al crear.</small>}
          {initialData && <small>Dejar en blanco para no cambiar.</small>}
        </div>

        <div className="form-group">
          <label htmlFor="rolId">Rol</label>
          <select id="rolId" name="rolId" value={formData.rolId} onChange={handleChange} required>
            <option value="">Seleccione un rol</option>
            {roles.map(rol => (
              <option key={rol.rolId} value={rol.rolId}>{rol.nombreRol}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico</label>
          <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => navigate('/admin/usuarios')} disabled={isSaving}>
            Cancelar
          </button>
          <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Usuario'}
          </button>
        </div>
      </div>
    </form>
  );
}
