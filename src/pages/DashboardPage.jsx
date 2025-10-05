export default function DashboardPage({ user }) {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Bienvenido, {user.nombreCompleto}</h1>
      <p>Rol: {user.rol}</p>
      <button onClick={() => window.location.reload()}>Cerrar sesión</button>
    </div>
  );
}