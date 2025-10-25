import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';

export const generateBarcodePdf = (producto) => {
  const doc = new jsPDF();
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, producto.sku, {
    format: "CODE128",
    lineColor: "#000",
    width: 2,
    height: 50,
    displayValue: true
  });

  const barcodeDataUrl = canvas.toDataURL('image/png');
  const barcodeWidth = 50; // 5cm
  const barcodeHeight = 20; // 2cm
  const margin = 10;
  const numCols = 3;
  const numRows = 10;
  let count = 0;

  for (let i = 0; i < 30; i++) { // Hardcoded to 30 copies
    if (count >= numCols * numRows) {
      doc.addPage();
      count = 0;
    }

    const row = Math.floor(count / numCols);
    const col = count % numCols;

    const x = margin + col * (barcodeWidth + margin);
    const y = margin + row * (barcodeHeight + margin);

    doc.addImage(barcodeDataUrl, 'PNG', x, y, barcodeWidth, barcodeHeight);

    count++;
  }

  doc.save(`barcodes-${producto.sku}.pdf`);
};
