import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMovimientos } from '../../api/dashboardApi';

const MovimientosRecientes = () => {
  const { data, error, isLoading } = useQuery({ queryKey: ['movimientos'], queryFn: getMovimientos });

  if (isLoading) return <div className="dashboard-card loading-placeholder">Cargando movimientos...</div>;
  // El error 500 de la API será atrapado aquí
  if (error || !data) return <div className="dashboard-card error-placeholder">Error al cargar movimientos</div>;

  const { ultimasEntradas = [], ultimasSalidas = [] } = data;

  return (
    <div className="dashboard-card movimientos-recientes">
      <h2>Movimientos Recientes</h2>
      <div className="movimientos-section">
        <h4>Últimas Entradas</h4>
        {ultimasEntradas.length > 0 ? (
          <ul>
            {ultimasEntradas.map((m, i) => (
              <li key={i}>{m.productoNombre} ({m.tipo}) - Cant: {m.cantidad}</li>
            ))}
          </ul>
        ) : (
          <p>No hay entradas recientes.</p>
        )}
      </div>
      <div className="movimientos-section">
        <h4>Últimas Salidas</h4>
        {ultimasSalidas.length > 0 ? (
          <ul>
            {ultimasSalidas.map((m, i) => (
              <li key={i}>{m.productoNombre} ({m.tipo}) - Cant: {m.cantidad}</li>
            ))}
          </ul>
        ) : (
          <p>No hay salidas recientes.</p>
        )}
      </div>
    </div>
  );
};

export default MovimientosRecientes;
