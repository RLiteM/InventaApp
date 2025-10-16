import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMovimientos } from '../../api/dashboardApi';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import '../../styles/DashboardV2.css';

const MovimientosRecientes = () => {
  const { data, error, isLoading } = useQuery({ queryKey: ['movimientos'], queryFn: getMovimientos });

  if (isLoading) return <div className="dashboard-card loading-placeholder">Cargando movimientos...</div>;
  if (error || !data) return <div className="dashboard-card error-placeholder">Error al cargar movimientos</div>;

  const { ultimasEntradas = [], ultimasSalidas = [] } = data;

  return (
    <div className="dashboard-card movimientos-recientes">
      <h2 className="titulo-movimientos">📦 Movimientos Recientes</h2>

      <div className="movimientos-grupos">

        {/* === ENTRADAS === */}
        <div className="movimientos-grupo">
          <h4 className="subtitulo entradas">⬆ Últimas Entradas</h4>
          <div className="lista-movimientos">
            {ultimasEntradas.length > 0 ? (
              ultimasEntradas.map((m, i) => (
                <motion.div
                  key={i}
                  className="mov-card entrada"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <ArrowUpCircle className="icono" />
                  <div>
                    <p className="nombre">{m.productoNombre}</p>
                    <p className="detalle">+{m.cantidad} unidades</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="sin-mov">No hay entradas recientes.</p>
            )}
          </div>
        </div>

        {/* === SALIDAS === */}
        <div className="movimientos-grupo">
          <h4 className="subtitulo salidas">⬇ Últimas Salidas</h4>
          <div className="lista-movimientos">
            {ultimasSalidas.length > 0 ? (
              ultimasSalidas.map((m, i) => (
                <motion.div
                  key={i}
                  className="mov-card salida"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <ArrowDownCircle className="icono" />
                  <div>
                    <p className="nombre">{m.productoNombre}</p>
                    <p className="detalle">-{m.cantidad} unidades</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="sin-mov">No hay salidas recientes.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MovimientosRecientes;
