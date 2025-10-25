import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getVentasDiaListado } from '../api/reportesApi';

export const generateVentasDiaListadoPdf = async () => {
  try {
    const data = await getVentasDiaListado();
    const doc = new jsPDF();

    const totalVentas = data.reduce((sum, item) => sum + item.montoTotal, 0);

    doc.text('Listado de Ventas del Día', 14, 20);
    doc.text(`Fecha del Reporte: ${new Date().toLocaleDateString()}`, 14, 28);

    autoTable(doc, {
      startY: 36,
      head: [['Vendedor', 'Cliente', 'Monto Total', 'Método de Pago']],
      body: data.map(item => [item.vendedor, item.cliente, `Q ${item.montoTotal.toFixed(2)}`, item.metodoPago]),
      foot: [['Total General', '', `Q ${totalVentas.toFixed(2)}`, '']]
    });

    doc.save('reporte-listado-ventas-dia.pdf');
  } catch (error) {
    console.error('Error generando el reporte de listado de ventas del día:', error);
    alert('No se pudo generar el reporte. Verifique la consola para más detalles.');
  }
};
