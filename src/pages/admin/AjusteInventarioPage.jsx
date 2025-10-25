
import React from 'react';
import AjusteInventarioForm from '../../components/admin/AjusteInventarioForm';
import '../../styles/AjusteInventario.css';

const AjusteInventarioPage = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return (
    <div className="ajuste-inventario-container">
      <h1>Ajuste de Inventario</h1>
      <AjusteInventarioForm user={userData} />
    </div>
  );
};

export default AjusteInventarioPage;
