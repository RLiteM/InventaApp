import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CambiarContrasenaForm.css';

const CambiarContrasenaForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setSuccess('');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('Contraseña cambiada con éxito');
    console.log('Nueva contraseña:', password);
  };

  return (
    <div className="cambiar-contrasena-form-container">
      <form onSubmit={handleSubmit} className="cambiar-contrasena-form">
        <h2>Cambiar Contraseña</h2>

        <div className="form-group">
          <label htmlFor="password">Nueva Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button type="submit">Cambiar Contraseña</button>

        {/* 👇 Botón para volver atrás */}
        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default CambiarContrasenaForm;
