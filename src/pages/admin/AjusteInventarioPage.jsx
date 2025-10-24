
import React from 'react';
import AjusteInventarioForm from '../../components/admin/AjusteInventarioForm';
import '../../styles/AjusteInventario.css';

const AjusteInventarioPage = ({ user }) => {
  return (
    <div className="ajuste-inventario-container">
      <h1>Ajuste de Inventario</h1>
      <AjusteInventarioForm user={user} />
    </div>
  );
};

export default AjusteInventarioPage;
