import React from 'react';
import AdminDashboardPage from './admin/DashboardPage';
import VendedorDashboardPage from './vendedor/DashboardPage';

// Este componente actúa como un "aiguillage" o "dispatcher".
// Recibe el usuario y, basándose en su rol, renderiza el dashboard correspondiente.

export default function Dashboard({ user }) {
  if (user?.rol === 'Administrador') {
    return <AdminDashboardPage />;
  }

  if (user?.rol === 'Vendedor') {
    return <VendedorDashboardPage />;
  }

  // Fallback por si el rol no es ninguno de los esperados pero el usuario existe.
  // Podrías redirigir a otra página o mostrar un mensaje.
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bienvenido</h1>
      <p>No tienes un dashboard asignado.</p>
    </div>
  );
}
