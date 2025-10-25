import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getVentasDia } from '../api/reportesApi';
import React from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import PieChartComponent from '../components/reports/PieChartComponent';

const renderPieChartToImage = async (data) => {
  const chartContainer = document.createElement('div');
  chartContainer.style.width = '400px';
  chartContainer.style.height = '400px';
  document.body.appendChild(chartContainer);

  const root = createRoot(chartContainer);
  const chartElement = React.createElement(PieChartComponent, { data });
  root.render(chartElement);

  const canvas = await html2canvas(chartContainer);
  const imgData = canvas.toDataURL('image/png');

  document.body.removeChild(chartContainer);

  return imgData;
};

export const generateVentasDiaPdf = async () => {
  try {
    const data = await getVentasDia();
    const doc = new jsPDF();

    doc.text('Resumen de Ventas del Día', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Métrica', 'Valor']],
      body: [
        ['Total de Ventas', data.totalVentas],
        ['Monto Total', `Q ${data.totalMonto.toFixed(2)}`],
        ['Promedio por Venta', `Q ${data.promedioVenta.toFixed(2)}`],
        ['Venta Máxima', `Q ${data.ventaMaxima.toFixed(2)}`],
        ['Venta Mínima', `Q ${data.ventaMinima.toFixed(2)}`]
      ]
    });

    doc.text('Resumen por Método de Pago', 14, doc.lastAutoTable.finalY + 10);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Método de Pago', 'Cantidad', 'Total']],
      body: data.resumenMetodosPago.map(item => [item.metodoPago, item.cantidad, `Q ${item.total.toFixed(2)}`])
    });

    const pieChartImage = await renderPieChartToImage(data.resumenMetodosPago.map(item => ({ name: item.metodoPago, value: item.total })));
    doc.addImage(pieChartImage, 'PNG', 14, doc.lastAutoTable.finalY + 10, 180, 100);

    doc.addPage();
    doc.text('Ventas Recientes', 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['ID', 'Fecha', 'Vendedor', 'Cliente', 'Monto', 'Método de Pago']],
      body: data.ventasRecientes.map(item => [item.ventaId, new Date(item.fechaVenta).toLocaleString(), item.vendedor, item.cliente, `Q ${item.montoTotal.toFixed(2)}`, item.metodoPago])
    });

    doc.save('reporte-ventas-dia.pdf');
  } catch (error) {
    console.error('Error generando el reporte de ventas del día:', error);
    alert('No se pudo generar el reporte. Verifique la consola para más detalles.');
  }
};
