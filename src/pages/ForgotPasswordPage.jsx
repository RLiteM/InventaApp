import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/login.css"; // Reutilizamos los estilos del login para consistencia

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(""); // Limpiar mensajes previos

    // --- ZONA DE LA API ---
    // Aquí es donde harías la llamada a tu backend para iniciar el proceso de recuperación.
    // Deberías enviar el `email` y manejar la respuesta.
    try {
      // Ejemplo de llamada (descomentar y adaptar cuando tengas el endpoint):
      // await api.post("/auth/forgot-password", { email });

      console.log("Solicitud de recuperación para:", email);
      setMensaje("Si el correo está registrado, recibirás un enlace para recuperar tu contraseña.");
    } catch (error) {
      setMensaje("Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo.");
    }
    // --- FIN DE ZONA DE LA API ---
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
          />
        </div>

        <button type="submit" className="login-button">
          Enviar Enlace
        </button>

        {mensaje && <p className="mensaje exito">{mensaje}</p>}

        <div className="form-options" style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link to="/login" className="forgot-password">
            Volver a Inicio de Sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
