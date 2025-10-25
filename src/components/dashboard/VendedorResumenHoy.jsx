import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getResumenHoyVendedor } from '../../api/dashboardApi';
import '../../styles/ResumenKPIs.css'; // Reutilizando estilos existentes

const VendedorResumenHoy = ({ usuarioId }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['resumenHoyVendedor', usuarioId],
    queryFn: () => getResumenHoyVendedor(usuarioId),
    enabled: !!usuarioId, // Solo ejecutar si el usuarioId está disponible
  });

  if (isLoading) return <div>Cargando resumen de hoy...</div>;
  if (isError) return <div>Error al cargar el resumen: {error.message}</div>;

  return (
    <div className="resumen-kpis-container"> {/* Reutilizando clase de estilo */}
      <div className="kpi-card">
        <h3>Total Vendido Hoy</h3>
        <p>Q {data?.totalVendidoHoy.toFixed(2) || '0.00'}</p>
      </div>
      <div className="kpi-card">
        <h3>Cantidad de Ventas Hoy</h3>
        <p>{data?.cantidadVentasHoy || 0}</p>
      </div>
      <div className="kpi-card">
        <h3>Clientes Atendidos Hoy</h3>
        <p>{data?.clientesAtendidosHoy || 0}</p>
      </div>
    </div>
  );
};

export default VendedorResumenHoy;
