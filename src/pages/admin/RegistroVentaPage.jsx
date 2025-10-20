
import { useState, useEffect, useContext } from 'react';
import { FiTrash2, FiCheckCircle, FiShoppingCart } from 'react-icons/fi';
import { FaPlus, FaMinus } from 'react-icons/fa';
import Select from 'react-select';
import api from '../../api/apiClient';
import '../../styles/RegistroVenta.css';
import { ThemeContext } from '../../context/ThemeProvider';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { getSelectStyles } from '../../styles/selectStyles';

// --- Iconos SVG para una apariencia nativa ---
const SearchIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);


// Assume user is fetched from a context or passed as a prop in a real app
const MOCK_USER_ID = 1;

export default function RegistroVentaPage() {

    const { theme } = useContext(ThemeContext);

  

    // Form state

    const [cliente, setCliente] = useState(() => {

      try {

        const savedCliente = localStorage.getItem('ventaCliente');

        return savedCliente ? JSON.parse(savedCliente) : null;

      } catch (error) { return null; }

    });

    const [metodoPago, setMetodoPago] = useState({ value: 'Efectivo', label: 'Efectivo' });

    const [saleDetails, setSaleDetails] = useState(() => {

      try {

        const savedDetails = localStorage.getItem('saleDetails');

        return savedDetails ? JSON.parse(savedDetails) : [];

      } catch (error) {

        return [];

      }

    });

    const [totalVenta, setTotalVenta] = useState(0);

    const [cantidadRecibida, setCantidadRecibida] = useState(() => localStorage.getItem('ventaCantidadRecibida') || '');

    const [cambio, setCambio] = useState(0);

  

    // API data state

    const [clientesOptions, setClientesOptions] = useState([]);

    const [allProducts, setAllProducts] = useState([]);

    const [filteredProducts, setFilteredProducts] = useState([]);

    const [allLotes, setAllLotes] = useState([]);

  

    // UI state

    const [productSearchTerm, setProductSearchTerm] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState(null);

  

    const metodosPagoOptions = [

      { value: 'Efectivo', label: 'Efectivo' },

      { value: 'Tarjeta', label: 'Tarjeta' },

      { value: 'Transferencia', label: 'Transferencia' },

    ];



    const fetchLotes = async () => {

        try {

          const lotesRes = await api.get('/lotes');

          setAllLotes(lotesRes.data);

        } catch (err) {

          console.error("Error fetching lotes:", err);

        }

      };

  

    useEffect(() => {

      const fetchInitialData = async () => {

        setIsLoading(true);

        try {

          const [clientsRes, productsRes, lotesRes] = await Promise.all([

            api.get('/clientes'),

            api.get('/productos/precios'),

            api.get('/lotes')

          ]);

  

          setClientesOptions(clientsRes.data.map(c => ({

            value: c.clienteId,

            label: `${c.nombreCompleto} (ID: ${c.identificacionFiscal})`,

            ...c

          })));

          setAllProducts(productsRes.data);

          setFilteredProducts(productsRes.data);

          setAllLotes(lotesRes.data);

  

        } catch (err) {

          setError('No se pudieron cargar los datos iniciales.');

        } finally {

          setIsLoading(false);

        }

      };

      fetchInitialData();

    }, []);

  

  useEffect(() => {

      const fetchProductsForClient = async () => {

        const tipoCliente = cliente ? (cliente.tipoCliente === 'Mayorista' ? 'Mayorista' : null) : null;

        try {

          const params = { tipoCliente };

          const productsRes = await api.get('/productos/precios', { params });

          const newProducts = productsRes.data;

          // Update master product list; let filtering effect react to this
          setAllProducts(prev => {
            // Preserve order of previous list when possible to minimize DOM churn
            const prevById = new Map(prev.map(p => [p.productoId, p]));
            const updated = prev.map(oldP => {
              const fresh = newProducts.find(n => n.productoId === oldP.productoId);
              return fresh ? { ...oldP, precioAplicable: fresh.precioAplicable } : oldP;
            });
            // Include any new products that weren't in previous list
            const prevIds = new Set(prev.map(p => p.productoId));
            const additions = newProducts.filter(n => !prevIds.has(n.productoId));
            return additions.length ? [...updated, ...additions] : updated;
          });

  

          // Update cart prices

          setSaleDetails(prevSaleDetails => {

            const newSaleDetails = prevSaleDetails.map(cartItem => {

              const productInNewList = newProducts.find(p => p.productoId === cartItem.productoId);

              if (productInNewList) {

                return { ...cartItem, precioAplicable: productInNewList.precioAplicable };

              }

              return cartItem;

            });

            return newSaleDetails;

          });

  

        } catch (err) {

          setError('No se pudieron cargar los productos.');

        } finally {
          // No UI loading swap for price updates to avoid flicker
        }

      };

  

      if (cliente) {

          fetchProductsForClient();

      }

    }, [cliente]);

  

    useEffect(() => {

      if (!productSearchTerm) {

        setFilteredProducts(allProducts);

        return;

      }

      const lowercasedTerm = productSearchTerm.toLowerCase();

      const results = allProducts.filter(p =>

        p.nombre.toLowerCase().includes(lowercasedTerm) ||

        p.sku.toLowerCase().includes(lowercasedTerm)

      );

      setFilteredProducts(results);

  

      if (results.length === 1 && results[0].sku.toLowerCase() === lowercasedTerm) {

        handleAddProduct(results[0]);

        setProductSearchTerm('');

      }

    }, [productSearchTerm, allProducts]);

  

  

    // Recalculate total and save sale details to localStorage

    useEffect(() => {

      const total = saleDetails.reduce((sum, item) => sum + (item.precioAplicable * item.cantidad), 0);

      setTotalVenta(total);

      localStorage.setItem('saleDetails', JSON.stringify(saleDetails));

    }, [saleDetails]);

  

    // Save client to localStorage

    useEffect(() => {

      if (cliente) {

        localStorage.setItem('ventaCliente', JSON.stringify(cliente));

      } else {

        localStorage.removeItem('ventaCliente');

      }

    }, [cliente]);

  

    // Save cash received to localStorage

    useEffect(() => {

      localStorage.setItem('ventaCantidadRecibida', cantidadRecibida);

    }, [cantidadRecibida]);

  

    // Calculate change

    useEffect(() => {

      const recibido = parseFloat(cantidadRecibida);

      if (!isNaN(recibido) && recibido >= totalVenta) {

        setCambio(recibido - totalVenta);

      } else {

        setCambio(0);

      }

    }, [cantidadRecibida, totalVenta]);

  

    const handleAddProduct = (productToAdd) => {

      if (saleDetails.find(item => item.productoId === productToAdd.productoId)) {

        handleQuantityChange(productToAdd.productoId, saleDetails.find(item => item.productoId === productToAdd.productoId).cantidad + 1);

        return;

      }

      setSaleDetails(prev => [...prev, { ...productToAdd, cantidad: 1 }]);

    };

  

  const handleRemoveProduct = (productId) => {

      setSaleDetails(prev => prev.filter(item => item.productoId !== productId));

  };

  const handleIncrement = (product) => {
    const totalStock = getTotalStock(product.productoId);
    if (product.cantidad < totalStock) {
      handleQuantityChange(product.productoId, product.cantidad + 1);
    }
  };

  const handleDecrement = (product) => {
    const newQty = product.cantidad - 1;
    if (newQty > 0) {
      handleQuantityChange(product.productoId, newQty);
    } else {
      handleRemoveProduct(product.productoId);
    }
  };

  

    const getTotalStock = (productId) => {
      return allLotes
        .filter(lote => lote.productoId === productId)
        .reduce((sum, lote) => sum + lote.cantidadActual, 0);
    };

    const handleQuantityChange = (productId, newQuantity) => {
      const quantity = Number(newQuantity);
      if (isNaN(quantity) || quantity < 0) return;

      setSaleDetails(prev => prev.map(item => {
        if (item.productoId === productId) {
          const totalStock = getTotalStock(productId);
          if (quantity > totalStock) {
            alert(`Stock total insuficiente. Máximo disponible: ${totalStock}`);
            return { ...item, cantidad: totalStock };
          }
          return { ...item, cantidad: quantity };
        }
        return item;
      }));
    };

  

    const handleClearSale = () => {

      setSaleDetails([]);

      setCliente(null);

      setMetodoPago({ value: 'Efectivo', label: 'Efectivo' });

      setCantidadRecibida('');

      localStorage.removeItem('ventaCantidadRecibida');

    };



    const generatePdfTicket = (venta) => {

        const doc = new jsPDF();

    

        doc.text("Ticket de Venta", 20, 20);

        doc.text(`Fecha: ${new Date().toLocaleString()}`, 20, 30);

        doc.text(`Cliente: ${cliente.label}`, 20, 40);

        doc.text(`Método de Pago: ${metodoPago.label}`, 20, 50);

    

        const tableColumn = ["Producto", "Cantidad", "Precio Unitario", "Subtotal"];

        const tableRows = [];

    

        venta.detalles.forEach(item => {

          const product = allProducts.find(p => p.productoId === item.productoId);

          const row = [

            product ? product.nombre : item.productoId,

            item.cantidad,

            `Q${item.precioUnitarioVenta.toFixed(2)}`,

            `Q${(item.cantidad * item.precioUnitarioVenta).toFixed(2)}`

          ];

          tableRows.push(row);

        });

    

        autoTable(doc, { head: [tableColumn], body: tableRows, startY: 60 });

    

        const finalY = doc.lastAutoTable.finalY || 70;

        doc.text(`Total: Q${venta.montoTotal.toFixed(2)}`, 140, finalY + 10);

    

        doc.save(`ticket_venta_${venta.ventaId || Date.now()}.pdf`);

      };

  

    const handleRealizarVenta = async () => {

      if (!cliente) {

        setError("Por favor, seleccione un cliente.");

        return;

      }

      setIsSubmitting(true);

      setError(null);

  

      // Stock check before creating the request
      for (const item of saleDetails) {
        const totalStock = getTotalStock(item.productoId);
        if (item.cantidad > totalStock) {
          setError(`Stock insuficiente para ${item.nombre}. Se intentan vender ${item.cantidad} pero solo hay ${totalStock} en stock.`);
          setIsSubmitting(false);
          return;
        }
      }

  

      const ventaRequest = {

        usuarioId: MOCK_USER_ID,

        clienteId: cliente.value,

        montoTotal: totalVenta,

        metodoPago: metodoPago.value,

        detalles: saleDetails.map(item => ({

          productoId: item.productoId,

          cantidad: item.cantidad,

          precioUnitarioVenta: item.precioAplicable,

        })),

      };



      try {
        const response = await api.post('/ventas', ventaRequest);
        alert('¡Venta realizada con éxito!');
        generatePdfTicket({ ...ventaRequest, ...response.data });
        handleClearSale();
        fetchLotes();
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Ocurrió un error inesperado al procesar la venta.");
        }
      } finally {
        setIsSubmitting(false);
      }

    };

  


  

    const canRealizarVenta = cliente && saleDetails.length > 0 && !isSubmitting;

  

    return (
      <div className="registro-venta-container">
        <div className="page-header"><h1>Registrar Nueva Venta</h1></div>
        <div className="main-content-area">
          <div className="form-column">

          {error && (
            <div
              className="error-message"
              onClick={() => setError(null)}
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <div className="client-row">
            <label className="client-label">Cliente:</label>
            <div className="client-input">
              <Select
                classNamePrefix="rv"
                styles={getSelectStyles(theme)}
                options={clientesOptions}
                onChange={setCliente}
                value={cliente}
                placeholder="Busque y seleccione un cliente..."
                isClearable
              />
            </div>
          </div>

          <div className="cart-panel">
            <div className="sale-table-wrapper custom-scrollbar">
              <table className="sale-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-right">P/U</th>
                  <th className="text-right">Subt.</th>
                  <th className="text-center">Ac.</th>
                </tr>
              </thead>
              <tbody>
                {saleDetails.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{textAlign:'center', padding:'1rem', color:'var(--text-color-secondary)'}}>Añade productos desde la lista de la derecha.</td>
                  </tr>
                ) : (
                  saleDetails.map(item => (
                    <tr key={item.productoId}>
                      <td>
                        <span className="name">{item.nombre}</span>
                      </td>
                      <td className="text-center">
                        <div className="quantity-control">
                          <button
                            className="qty-btn qty-minus"
                            onClick={() => handleDecrement(item)}
                            aria-label={`Disminuir cantidad de ${item.nombre}`}
                            disabled={item.cantidad <= 1}
                          >
                            <FaMinus style={{ color: '#fff', width: '14px', height: '14px' }} />
                          </button>
                          <span className="qty-value" aria-live="polite">{item.cantidad}</span>
                          <button
                            className="qty-btn qty-plus"
                            onClick={() => handleIncrement(item)}
                            aria-label={`Aumentar cantidad de ${item.nombre}`}
                            disabled={item.cantidad >= getTotalStock(item.productoId)}
                          >
                            <FaPlus style={{ color: '#fff', width: '14px', height: '14px' }} />
                          </button>
                        </div>
                      </td>
                      <td className="text-right unit-price-cell">Q{item.precioAplicable?.toFixed(2)}</td>
                      <td className="text-right line-subtotal">Q{(item.precioAplicable * item.cantidad).toFixed(2)}</td>
                      <td className="text-center">
                        <button onClick={() => handleRemoveProduct(item.productoId)} className="remove-item-btn" aria-label={`Quitar ${item.nombre}`}><FiTrash2 /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>

          {/* Pago, Totales (siempre visibles) y Acciones */}
          <div className="venta-panel">
            <div className="payment-row">
              <div className="payment-controls">
                <div className="form-group">
                  <label>Método de Pago</label>
                <Select classNamePrefix="rv" styles={getSelectStyles(theme)} options={metodosPagoOptions} value={metodoPago} onChange={setMetodoPago} />
                </div>
                {metodoPago?.value === 'Efectivo' && (
                  <div className="form-group">
                    <label>Efectivo recibido</label>
                  <input 
                    type="number" 
                    placeholder="Ingrese el monto..."
                    className="cash-input"
                    value={cantidadRecibida}
                    onChange={(e) => setCantidadRecibida(e.target.value)}
                  />
                  </div>
                )}
              </div>
              <div className="totals-inline">
                <div className="total-amount">TOTAL: <strong>Q{totalVenta.toFixed(2)}</strong></div>
                {metodoPago?.value === 'Efectivo' && cantidadRecibida >= totalVenta && totalVenta > 0 && (
                  <div className="change-amount">Cambio: <strong>Q{cambio.toFixed(2)}</strong></div>
                )}
              </div>
            </div>
            <div className="actions-section">
              <button className="btn btn-secondary" onClick={handleClearSale} title="Vaciar Carrito"><FiTrash2 className="icon" /> Vaciar Carrito</button>
              <button className="btn btn-primary" onClick={handleRealizarVenta} disabled={!canRealizarVenta} title="Vender">
                {isSubmitting ? 'Procesando...' : (<><FiCheckCircle className="icon" /> Vender</>)}
              </button>
            </div>
          </div>

        </div>

          <div className="product-list-column">

          <h2 className="section-title">Buscar Productos</h2>
          <div className="product-search-input-container">
            <SearchIcon className="product-search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              className="product-search-input"
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
              aria-label="Buscar productos por nombre o SKU"
            />
          </div>

          <div className="product-table-wrapper custom-scrollbar">
            {isLoading ? (
              <p style={{padding:'0.75rem'}}>Cargando...</p>
            ) : (
              <table className="product-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Producto</th>
                    <th className="text-center">Stock</th>
                    <th className="text-right">P/U</th>
                    <th className="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{textAlign:'center', padding:'1rem', color:'var(--text-color-secondary)'}}>No se encontraron productos.</td>
                    </tr>
                  ) : (
                    filteredProducts.map(p => {
                      const totalStock = allLotes
                        .filter(lote => lote.productoId === p.productoId)
                        .reduce((sum, lote) => sum + lote.cantidadActual, 0);
                      const itemInCart = saleDetails.find(item => item.productoId === p.productoId);
                      const currentStock = itemInCart ? totalStock - itemInCart.cantidad : totalStock;
                      return (
                        <tr key={p.productoId} className="row-clickable" onClick={() => handleAddProduct(p)}>
                          <td className="sku-cell">{p.sku}</td>
                          <td className="name-cell">{p.nombre}</td>
                          <td className="text-center">
                            {currentStock > 0 ? (
                              <span className={`${currentStock < 20 ? 'stock-status-medium' : 'stock-status-high'}`}>{currentStock}</span>
                            ) : (
                              <span className="stock-status-low">Agotado</span>
                            )}
                          </td>
                          <td className="text-right price-cell">{p.precioAplicable ? `Q${p.precioAplicable.toFixed(2)}` : 'N/A'}</td>
                          <td className="text-center">
                            <button
                              className="add-to-cart-btn quantity-change-btn"
                              onClick={(e) => { e.stopPropagation(); handleAddProduct(p); }}
                              disabled={currentStock <= 0}
                              title="Agregar"
                              aria-label={`Agregar ${p.nombre} al carrito`}
                            >
                              <FaPlus style={{ color: '#fff', width: '14px', height: '14px' }} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
