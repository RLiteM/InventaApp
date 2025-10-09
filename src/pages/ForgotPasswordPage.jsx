import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/apiClient"; // Importar el cliente de API
import "../styles/login.css"; // Reutilizamos los estilos del login para consistencia

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/solicitar-recuperacion", { email });
      setMensaje("Si el correo está registrado, recibirás un enlace para recuperar tu contraseña.");
    } catch (err) {
      setError("Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-header">
          <h2>Recuperar Contraseña</h2>
          <p>Ingresa tu correo para recibir un enlace de recuperación.</p>
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Enlace'}
        </button>

        {mensaje && <p className="mensaje exito">{mensaje}</p>}
        {error && <p className="mensaje error">{error}</p>}

        <div className="form-options" style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link to="/login" className="forgot-password">
            Volver a Inicio de Sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
