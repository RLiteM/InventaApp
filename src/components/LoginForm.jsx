import { useState } from "react";
import api from "../api/apiClient";
import "./../styles/login.css";

export default function LoginForm({ onLoginSuccess }) {
  const [nombreUsuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", {
        nombreUsuario,
        contrasena,
      });
      setMensaje(`Bienvenido ${response.data.nombreCompleto}`);
      onLoginSuccess(response.data);
    } catch (error) {
      setMensaje("Credenciales incorrectas o error de conexión");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Inicio de Sesión</h2>

      <input
        type="text"
        placeholder="Usuario"
        value={nombreUsuario}
        onChange={(e) => setUsuario(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        required
      />

      <button type="submit">Ingresar</button>
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </form>
  );
}
