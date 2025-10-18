
import { useState, useEffect, useContext } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import Select from 'react-select';
import api from '../../api/apiClient';
import '../../styles/RegistroVenta.css';
import { ThemeContext } from '../../context/ThemeProvider';

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
    const [metodoPago, setMetodoPago] = useState({ value: 'EFECTIVO', label: 'Efectivo' });
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
      { value: 'EFECTIVO', label: 'Efectivo' },
      { value: 'TARJETA', label: 'Tarjeta' },
      { value: 'TRANSFERENCIA', label: 'Transferencia' },
    ];
  
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
        setIsLoading(true);
        try {
          const params = { tipoCliente };
          const productsRes = await api.get('/productos/precios', { params });
          const newProducts = productsRes.data;
          setAllProducts(newProducts);
          setFilteredProducts(newProducts);
  
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
          setIsLoading(false);
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
  
    const handleQuantityChange = (productId, newQuantity) => {
      const quantity = Number(newQuantity);
      if (isNaN(quantity) || quantity < 0) return;
  
      setSaleDetails(prev => prev.map(item => {
        if (item.productoId === productId) {
          const totalStock = allLotes
            .filter(lote => lote.productoId === productId)
            .reduce((sum, lote) => sum + lote.cantidadActual, 0);
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
      setMetodoPago({ value: 'EFECTIVO', label: 'Efectivo' });
      setCantidadRecibida('');
      localStorage.removeItem('ventaCantidadRecibida');
    };
  
    const handleRealizarVenta = async () => {
      if (!cliente) {
        setError("Por favor, seleccione un cliente.");
        return;
      }
      setIsSubmitting(true);
      setError(null);
  
      const finalSaleDetails = [];
      let stockError = null;
  
      for (const item of saleDetails) {
        let cantidadPorSurtir = item.cantidad;
        const lotesDelProducto = allLotes
          .filter(l => l.productoId === item.productoId && l.cantidadActual > 0)
          .sort((a, b) => new Date(a.fechaIngreso) - new Date(b.fechaIngreso)); // FIFO
  
        for (const lote of lotesDelProducto) {
          if (cantidadPorSurtir === 0) break;
          const cantidadTomada = Math.min(cantidadPorSurtir, lote.cantidadActual);
          finalSaleDetails.push({
            loteId: lote.loteId,
            cantidad: cantidadTomada,
            precioUnitarioVenta: item.precioAplicable,
          });
          cantidadPorSurtir -= cantidadTomada;
        }
  
        if (cantidadPorSurtir > 0) {
          stockError = `Stock insuficiente para ${item.nombre}. Se intentaron vender ${item.cantidad} pero solo hay ${item.cantidad - cantidadPorSurtir} disponibles en todos los lotes.`;
          break;
        }
      }
  
      if (stockError) {
        setError(stockError);
        setIsSubmitting(false);
        return;
      }
  
      const ventaRequest = {
        usuarioId: MOCK_USER_ID,
        clienteId: cliente.value,
        metodoPago: metodoPago.value,
        detalles: finalSaleDetails,
      };
  
      try {
        await api.post('/ventas', ventaRequest);
        alert('¡Venta realizada con éxito!');
        handleClearSale();
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          if (err.response.status === 404) {
            console.error('Data inconsistency error:', err.response.data.message);
            setError("Error al procesar el producto. Por favor, contacte a soporte.");
          } else { // Handles 400 and other errors with a message
            setError(err.response.data.message);
          }
        } else {
          setError("Ocurrió un error inesperado al procesar la venta.");
        }
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const getSelectStyles = (theme) => {
      const isDark = theme === 'dark';
      return {
          control: (p, s) => ({ ...p, backgroundColor: isDark ? '#2d3748' : '#ffffff', borderColor: s.isFocused ? (isDark ? '#00796b' : '#00695c') : (isDark ? '#4a5568' : '#e2e8f0'), color: isDark ? '#f7fafc' : '#2d3748', boxShadow: s.isFocused ? `0 0 0 1px ${isDark ? '#00796b' : '#00695c'}` : 'none', '&:hover': { borderColor: isDark ? '#00796b' : '#00695c' } }),
          menu: p => ({ ...p, backgroundColor: isDark ? '#2d3748' : '#ffffff', zIndex: 9999 }),
          option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? (isDark ? '#00796b' : '#00695c') : s.isFocused ? (isDark ? '#4a5568' : '#e6f6f3') : 'transparent', color: s.isSelected ? '#ffffff' : (isDark ? '#f7fafc' : '#2d3748'), '&:active': { backgroundColor: isDark ? '#00796b' : '#00695c' } }),
          singleValue: p => ({ ...p, color: isDark ? '#f7fafc' : '#2d3748' }),
          input: p => ({ ...p, color: isDark ? '#f7fafc' : '#2d3748' }),
          placeholder: p => ({ ...p, color: isDark ? '#a0aec0' : '#a0aec0' }),
      };
    };
  
    const canRealizarVenta = cliente && saleDetails.length > 0 && !isSubmitting;
  
    return (
      <div className="registro-venta-container">
        <div className="form-column">
          <div className="page-header"><h1>Registrar Nueva Venta</h1></div>
          {error && <div className="error-message" onClick={() => setError(null)} style={{cursor: 'pointer'}}>{error}</div>}
          <div className="form-section">
            <div className="form-group">
              <label>Cliente</label>
              <Select styles={getSelectStyles(theme)} options={clientesOptions} onChange={setCliente} value={cliente} placeholder="Busque y seleccione un cliente..." isClearable />
            </div>
            <div className="form-group">
              <label>Método de Pago</label>
              <Select styles={getSelectStyles(theme)} options={metodosPagoOptions} value={metodoPago} onChange={setMetodoPago} />
            </div>
            {metodoPago?.value === 'EFECTIVO' && (
              <div className="form-group">
                <label>Efectivo recibido</label>
                <input 
                  type="number" 
                  placeholder="Ingrese el monto..."
                  value={cantidadRecibida}
                  onChange={(e) => setCantidadRecibida(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="sale-details-header"><span>Producto</span><span>Cantidad</span><span>Subtotal</span><span></span></div>
          <div className="sale-details-list">
            {saleDetails.length === 0 ? <p>Añade productos desde la lista de la derecha.</p> : saleDetails.map(item => (
              <div key={item.productoId} className="sale-details-item">
                <span className="product-name">{item.nombre}</span>
                <input type="number" min="1" value={item.cantidad} onChange={(e) => handleQuantityChange(item.productoId, e.target.value)} />
                <span>Q{(item.precioAplicable * item.cantidad).toFixed(2)}</span>
                <button onClick={() => handleRemoveProduct(item.productoId)} className="remove-item-btn"><FiTrash2 /></button>
              </div>
            ))}
          </div>
          <div className="totals-section">
            <div className="total-row grand-total">
              <span>TOTAL:</span>
              <span>Q{totalVenta.toFixed(2)}</span>
            </div>
            {metodoPago?.value === 'EFECTIVO' && cantidadRecibida >= totalVenta && totalVenta > 0 && (
              <div className="total-row">
                <span>Cambio:</span>
                <span>Q{cambio.toFixed(2)}</span>
              </div>
            )}
            <div>
              <button className="limpiar-btn" onClick={handleClearSale}>Limpiar</button>
              <button className="realizar-btn" onClick={handleRealizarVenta} disabled={!canRealizarVenta}>{isSubmitting ? 'Procesando...' : 'Realizar'}</button>
            </div>
          </div>
        </div>
        <div className="product-list-column">
          <div className="page-header"><h2>Buscar Productos</h2></div>
          <input type="text" placeholder="Buscar por nombre o SKU..." className="product-search-input" value={productSearchTerm} onChange={(e) => setProductSearchTerm(e.target.value)} />
          <div className="product-list-headers">
            <div className="product-list-header-item">SKU</div>
            <div className="product-list-header-item">Producto</div>
            <div className="product-list-header-item">Stock</div>
            <div className="product-list-header-item text-right">Precio</div>
          </div>
          <div className="product-cards-container">
            {isLoading ? <p>Cargando...</p> : (
              filteredProducts.map(p => {
                const totalStock = allLotes
                  .filter(lote => lote.productoId === p.productoId)
                  .reduce((sum, lote) => sum + lote.cantidadActual, 0);
  
                const itemInCart = saleDetails.find(item => item.productoId === p.productoId);
                const currentStock = itemInCart ? totalStock - itemInCart.cantidad : totalStock;
  
                return (
                  <div key={p.productoId} className="product-card" onClick={() => handleAddProduct(p)}>
                    <div className="product-card-item product-card-sku">{p.sku}</div>
                    <div className="product-card-item product-card-name">{p.nombre}</div>
                    <div className={`product-card-item product-card-stock ${
                        currentStock > 10 ? 'stock-status-high' :
                        currentStock > 0 ? 'stock-status-medium' :
                        'stock-status-low'
                      }`}>{currentStock}</div>
                    <div className="product-card-item product-card-price">Q{p.precioAplicable ? p.precioAplicable.toFixed(2) : 'N/A'}</div>
                  </div>
                )
              })
            )}
            {filteredProducts.length === 0 && !isLoading && <p>No se encontraron productos.</p>}
          </div>
        </div>
      </div>
  );
}

