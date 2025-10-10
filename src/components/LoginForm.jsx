import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/apiClient";
import "./../styles/login.css";

export default function LoginForm({ onLoginSuccess }) {
  const [nombreUsuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje({ texto: "", tipo: "" }); // Limpiar mensaje previo

    try {
      const response = await api.post("/auth/login", {
        nombreUsuario,
        contrasena,
      });

      // Guardar el token y los datos del usuario
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userData", JSON.stringify(response.data));

      setMensaje({ texto: `Bienvenido ${response.data.nombreCompleto}`, tipo: "exito" });
      
      // Esperar un momento para que el usuario vea el mensaje de bienvenida
      setTimeout(() => {
        onLoginSuccess(response.data);
      }, 1000);
    } catch (error) {
      setMensaje({ texto: "Credenciales incorrectas o error de conexión.", tipo: "error" });
      setIsLoading(false);
    }
    // No ponemos el setIsLoading(false) aquí para que el timeout de éxito funcione
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-header">
        <h2>Inicio de Sesión</h2>
        <p>Ingresa tus datos para continuar</p>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={nombreUsuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="input-group">
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <button type="submit" className="login-button" disabled={isLoading}>
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>

      {mensaje.texto && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}
    </form>
  );
}
