import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getProductosResumenListado } from '../api/reportesApi';

export const generateInventarioActualPdf = async () => {
  try {
    const data = await getProductosResumenListado();
    const doc = new jsPDF({ orientation: 'landscape' }); // Set landscape orientation

    doc.text('Reporte de Inventario Actual', 14, 20);
    doc.text(`Fecha del Reporte: ${new Date().toLocaleDateString()}`, 14, 28);

    autoTable(doc, {
      startY: 36,
      head: [['Métrica', 'Valor']],
      body: [
        ['Total de Productos', data.resumen.totalProductos],
        ['Stock Total', data.resumen.stockTotal],
        ['Valor del Inventario', `Q ${data.resumen.valorInventario.toFixed(2)}`],
        ['Productos Sin Stock', data.resumen.productosSinStock],
        ['Productos con Bajo Stock', data.resumen.productosBajoStock]
      ]
    });

    let finalY = doc.lastAutoTable.finalY + 10;
    doc.text('Listado de Productos', 14, finalY);

    autoTable(doc, {
      startY: finalY + 8,
      head: [['SKU', 'Nombre', 'Categoría', 'U/M', 'Stock', 'Stock Mín.', 'P. Minorista', 'P. Mayorista', 'Costo']],
      body: data.items.map(item => [
        item.sku,
        item.nombre,
        item.categoria,
        item.unidadMedida,
        item.stockActual,
        item.stockMinimo,
        `Q ${item.precioMinorista.toFixed(2)}`,
        `Q ${item.precioMayorista.toFixed(2)}`,
        `Q ${item.ultimoCosto.toFixed(2)}`
      ]),
      didParseCell: function(cell) {
        const item = data.items[cell.row.index];
        if (item) {
          if (!cell.row.styles) {
            cell.row.styles = {};
          }
          if (item.stockActual === 0) {
            cell.row.styles.fillColor = [255, 200, 200]; // Light red for no stock
          }
          else if (item.stockActual <= item.stockMinimo) {
            cell.row.styles.fillColor = [255, 230, 180]; // Light orange for low stock
          }
        }
      },
    });

    doc.save('reporte-inventario-actual.pdf');
  } catch (error) {
    console.error('Error generando el reporte de inventario actual:', error);
    alert('No se pudo generar el reporte. Verifique la consola para más detalles.');
  }
};
