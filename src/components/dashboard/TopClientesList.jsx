import React from 'react';
import { useQuery } from 'react-query';
import { getTopClientes } from '../../api/dashboardApi';

const TopClientesList = () => {
  const { data: topClientes = [], error, isLoading } = useQuery('topClientes', getTopClientes);

  if (isLoading) return <div className="dashboard-card loading-placeholder">Cargando clientes...</div>;
  if (error) return <div className="dashboard-card error-placeholder">Error al cargar clientes</div>;

  const formatCurrency = (value) => 
    `Q ${(value ?? 0).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="dashboard-card top-clientes-list">
      <h2>Top 5 Clientes</h2>
      {topClientes.length > 0 ? (
        <ol>
          {topClientes.map(cliente => (
            <li key={cliente.clienteId}>
              <span>{cliente.nombreCliente}</span>
              <span>{formatCurrency(cliente.montoTotalGastado)}</span>
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
