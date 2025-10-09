import React, { useState } from 'react';
import Modal from 'react-modal';
import { solicitarRecuperacion } from '../api/apiClient';
import '../styles/RecuperarContrasena.css';

Modal.setAppElement('#root');

const RecuperarContrasena = ({ isOpen, onRequestClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await solicitarRecuperacion(email);
      setMessage(response.data.message);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('No se pudo conectar con el servidor. Verifique su conexión a internet.');
      } else {
        setError('Ocurrió un error inesperado. Por favor, inténtelo de nuevo.');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Recuperar Contraseña"
      className="modal-recuperar"
      overlayClassName="overlay-recuperar"
    >
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <p>Ingrese su correo electrónico para recibir un enlace de recuperación.</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="su-correo@ejemplo.com"
          required
        />
        <div className="modal-buttons">
          <button type="submit" className="btn-enviar">Enviar Enlace</button>
          <button type="button" onClick={onRequestClose} className="btn-cancelar">Cancelar</button>
        </div>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </Modal>
  );
};

export default RecuperarContrasena;
