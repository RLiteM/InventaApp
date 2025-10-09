import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetearPassword } from '../api/apiClient';
import '../styles/ResetearPassword.css';

const ResetearPassword = () => {
  const [token, setToken] = useState(null);
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Token no encontrado o inválido.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await resetearPassword(token, nuevaContrasena);
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Error al restablecer la contraseña. El token puede ser inválido o haber expirado.');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2>Restablecer Contraseña</h2>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        {token ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <input
                type="password"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit">Actualizar Contraseña</button>
          </form>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
    </div>
  );
};

export default ResetearPassword;
