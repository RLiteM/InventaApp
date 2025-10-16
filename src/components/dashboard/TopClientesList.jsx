import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTopClientes } from '../../api/dashboardApi';
import '../../styles/TopClientesList.css'; // <-- Import corregido para la carpeta styles

const TopClientesList = () => {
  const { data: topClientes = [], error, isLoading } = useQuery({
    queryKey: ['topClientes'],
    queryFn: getTopClientes,
  });

  if (isLoading) return <div className="top-clientes-card loading-placeholder">Cargando clientes...</div>;
  if (error) return <div className="top-clientes-card error-placeholder">Error al cargar clientes</div>;

  const formatCurrency = (value) =>
    `Q ${(value ?? 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="top-clientes-card">
      <h2>Top 5 Clientes</h2>
      {topClientes.length > 0 ? (
        <ol className="top-clientes-list">
          {topClientes.map((cliente, index) => (
            <li key={cliente.clienteId} className={`cliente-item cliente-${index + 1}`}>
              <span className="cliente-nombre">{cliente.nombreCliente}</span>
              <span className="cliente-monto">{formatCurrency(cliente.montoTotalGastado)}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p>No hay datos de clientes para mostrar.</p>
      )}
    </div>
  );
};

export default TopClientesList;
