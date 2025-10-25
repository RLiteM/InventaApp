import React, { useState, useContext } from 'react';
import Select from 'react-select';
import { ThemeContext } from '../../context/ThemeProvider';
import { getSelectStyles } from '../../styles/selectStyles';
import { generateVentasDiaPdf } from '../../utils/generateVentasDiaPdf';
import { generateVentasDiaListadoPdf } from '../../utils/generateVentasDiaListadoPdf';
import { generateInventarioActualPdf } from '../../utils/generateInventarioActualPdf';
import '../../styles/GenerarReportes.css';

const GenerarReportesPage = () => {
    const { theme } = useContext(ThemeContext);
    const [selectedReport, setSelectedReport] = useState(null);

    const reportOptions = [
        { value: 'resumen_dia', label: 'Resumen del día (Cierre de caja)' },
        { value: 'listado_ventas_dia', label: 'Listado de Ventas del Dia' },
        { value: 'inventario_actual', label: 'Reporte de Inventario' },
    ];

    const handleGenerateReport = () => {
        if (selectedReport) {
            switch (selectedReport.value) {
                case 'resumen_dia':
                    generateVentasDiaPdf();
                    break;
                case 'listado_ventas_dia':
                    generateVentasDiaListadoPdf();
                    break;
                case 'inventario_actual':
                    generateInventarioActualPdf();
                    break;
                default:
                    alert('Este reporte no está implementado aún.');
            }
        }
    };

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
                        onChange={setSelectedReport}
                        value={selectedReport}
                    />
                </div>
                <div className="form-actions">
                    <button className="btn btn-primary" onClick={handleGenerateReport} disabled={!selectedReport}>
                        Generar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenerarReportesPage;
