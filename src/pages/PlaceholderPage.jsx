import "../styles/login.css"; // Reutilizamos estilos para mantener la consistencia

export default function PlaceholderPage({ user }) {
  return (
    <div className="login-page">
      <div className="login-form">
        <div className="login-header">
          <h2>Bienvenido, {user?.nombreCompleto || "Usuario"}</h2>
          <p>Actualmente no tienes permisos de administrador.</p>
          <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#004d40" }}>
            Si crees que esto es un error, por favor contacta al soporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
}
