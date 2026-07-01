import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";

export default function Cart() {
  const { items, dispatch, subtotal, iva, discount, total, getStock, getFinalPrice, getOriginalPrice } = useCart();
  
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [animatingId, setAnimatingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 20000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleQuantityChange = (id, newQuantity) => {
    const qty = parseInt(newQuantity);
    if (!isNaN(qty)) {
      dispatch({
        type: "SET_QUANTITY",
        payload: { id, quantity: qty }
      });
    }
  };

  const requestRemoveItem = (item) => {
    setItemToRemove(item);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      const productName = itemToRemove.title;
      setAnimatingId(itemToRemove.id);
      
      setTimeout(() => {
        dispatch({ type: "REMOVE_ITEM", payload: itemToRemove.id });
        setAnimatingId(null);
        setItemToRemove(null);
        setSuccessMessage(`${productName} eliminado correctamente`);
      }, 300);
    }
  };

  const cancelRemove = () => {
    setItemToRemove(null);
  };

  const confirmClearCart = () => {
    dispatch({ type: "CLEAR" });
    setShowClearConfirm(false);
    setSuccessMessage("🛒 Carrito vaciado correctamente");
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <span className="cart-empty-icon">🛒</span>
        <p>Tu carrito está vacío</p>
      </div>
    );
  }

  return (
    <div className="cart">
      {successMessage && <div className="success-toast">{successMessage}</div>}

      <div className="cart-items">
        {items.map((item) => {
          const stock = getStock(item);
          const remaining = stock - item.quantity;
          const isRemoving = animatingId === item.id;
          
          const originalPrice = getOriginalPrice(item);
          const finalPrice = getFinalPrice(item);
          const hasDiscount = item.discount > 0;
          const itemSubtotalOriginal = originalPrice * item.quantity;
          const itemSubtotalFinal = finalPrice * item.quantity;

          return (
            <div key={item.id} className={`cart-item ${isRemoving ? 'removing' : ''}`}>
              <img src={item.image} alt={item.title} className="cart-item-img" onError={(e) => { e.target.style.display = "none"; }} />
              
              <div className="cart-item-info">
                <h4>{item.title}</h4>
                <div>
                  {hasDiscount ? (
                    <>
                      <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '13px' }}>
                        ${originalPrice.toFixed(2)}
                      </span><br />
                      <strong style={{ color: '#e74c3c' }}>${finalPrice.toFixed(2)}</strong>
                      <span style={{ color: '#27ae60', fontSize: '13px', marginLeft: '6px' }}>-{item.discount}%</span>
                    </>
                  ) : (
                    <strong>${originalPrice.toFixed(2)}</strong>
                  )}
                </div>
                {remaining <= 3 && remaining > 0 && <p className="stock-warning">¡Solo quedan {remaining} unidades!</p>}
                {remaining <= 0 && <p className="stock-warning error">Sin stock disponible</p>}
              </div>

              <div className="cart-item-qty">
                <button className="btn btn-sm" onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity - 1 } })}>−</button>
                
                <input
                  type="number"
                  min="1"
                  max={stock}
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="qty-input"
                />

                <button 
                  className="btn btn-sm btn-success" 
                  disabled={item.quantity >= stock} 
                  onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity + 1 } })}
                >
                  +
                </button>
              </div>

              <p className="cart-item-subtotal">
                ${itemSubtotalFinal.toFixed(2)}
                {hasDiscount && <span style={{ display: 'block', fontSize: '12px', color: '#27ae60' }}>
                  Ahorras ${(itemSubtotalOriginal - itemSubtotalFinal).toFixed(2)}
                </span>}
              </p>

              <button className="btn btn-sm btn-danger" onClick={() => requestRemoveItem(item)} title="Eliminar">×</button>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <div className="cart-summary-row"><span>Subtotal </span><span>${subtotal.toFixed(2)}</span></div>
        <div className="cart-summary-row"><span>IVA (16%)</span><span>${iva.toFixed(2)}</span></div>
        <div className="cart-summary-row"><span>Descuento total</span><span className="discount">- ${discount.toFixed(2)}</span></div>
        <div className="cart-summary-row cart-summary-total">
          <span><strong>Total a pagar</strong></span>
          <span><strong>${total.toFixed(2)}</strong></span>
        </div>
        
        <button className="btn btn-danger btn-block" onClick={() => setShowClearConfirm(true)}>
          Vaciar carrito
        </button>
      </div>

      {/* Modal Eliminar Producto */}
      {itemToRemove && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Eliminar producto</h3>
            <p>¿Estás seguro de eliminar <strong>{itemToRemove.title}</strong>?</p>
            <div className="modal-actions">
              <button className="btn" onClick={cancelRemove}>Cancelar</button>
              <button className="btn btn-danger" onClick={confirmRemoveItem}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Vaciar Carrito */}
      {showClearConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>¿Vaciar el carrito?</h3>
            <p>Esta acción no se puede deshacer.</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowClearConfirm(false)}>Cancelar</button>
              <button className="btn btn-danger" onClick={confirmClearCart}>Sí, vaciar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}