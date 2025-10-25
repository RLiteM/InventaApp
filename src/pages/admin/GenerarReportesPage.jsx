import React, { useContext } from 'react';
import Select from 'react-select';
import { ThemeContext } from '../../context/ThemeProvider';
import { getSelectStyles } from '../../styles/selectStyles';
import '../../styles/GenerarReportes.css';

const GenerarReportesPage = () => {
    const { theme } = useContext(ThemeContext);

    const reportOptions = [
        { value: 'ventas_mes', label: 'Ventas del mes y Ganancias' },
        { value: 'inventario_actual', label: 'Listado de inventario (Stock actual)' },
        { value: 'productos_mas_vendidos', label: 'Productos más y menos vendidos' },
        { value: 'historial_compras', label: 'Historial de compras' },
        { value: 'listado_proveedores', label: 'Listado general de proveedores' },
        { value: 'resumen_dia', label: 'Resumen del día (Cierre de caja)' },
    ];

    return (
        <div className="generar-reportes-container">
            <h1>Generar Reportes</h1>
            <div className="form-section">
                <div className="form-group">
                    <label>Tipo de Reporte</label>
                    <Select
                        styles={getSelectStyles(theme)}
                        options={reportOptions}
                        placeholder="Seleccione un tipo de reporte"
                    />
                </div>
                <div className="form-actions">
                    <button className="btn btn-primary">Generar</button>
                </div>
            </div>
        </div>
    );
};

export default GenerarReportesPage;
