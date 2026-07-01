import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function validateConnection() {
  const res = await fetch("https://dummyjson.com/users?limit=1");
  if (!res.ok) throw new Error("Error de conexión con el servidor");
  return true;
}

async function validateInventory(items, allProducts) {
  const stockMap = {};
  for (const p of allProducts) {
    stockMap[p.id] = p.rating?.count ?? p.stock ?? 0;
  }
  for (const item of items) {
    if ((stockMap[item.id] ?? 0) < item.quantity) {
      throw new Error(`Stock insuficiente para: ${item.title}`);
    }
  }
  return true;
}

async function sendOrder(order) {
  const res = await fetch("https://dummyjson.com/carts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: order.userId || 1,
      products: order.items.map((i) => ({ id: i.id, quantity: i.quantity })),
    }),
  });
  if (!res.ok) throw new Error("Error al enviar el pedido");
  return res.json();
}

export default function Checkout({ products, onDone, onBack }) {
  const { items, subtotal, iva, discount, total, dispatch, getFinalPrice } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(null);
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError("");
    setTicket(null);

    try {
      setStep("Validando conexión...");
      await delay(500);
      await validateConnection();

      setStep("Validando inventario...");
      await delay(500);
      await validateInventory(items, products);

      setStep("Procesando pedido...");
      await delay(800);

      const serverResponse = await sendOrder({ items });

      setTicket({
        items,
        subtotal,
        iva,
        discount,
        total,
        id: serverResponse.id || Date.now(),
        date: new Date().toLocaleString(),
      });
      dispatch({ type: "CLEAR" });
    } catch (e) {
      setError(e.message);
      setStep(null);
    } finally {
      setLoading(false);
    }
  };

  if (ticket) {
    return (
      <div className="ticket">
        <div className="ticket-card">
          <h2>¡Pedido Confirmado!</h2>
          <p className="ticket-id">Pedido #{ticket.id}</p>
          <p className="ticket-date">{ticket.date}</p>

          <div className="ticket-items">
            {ticket.items.map((i) => {
              const finalPrice = getFinalPrice ? getFinalPrice(i) : (i.finalPrice || i.price);
              return (
                <div key={i.id} className="ticket-item">
                  <span>{i.title}</span>
                  <span>{i.quantity} x ${finalPrice.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="ticket-summary">
            <div className="ticket-row">
              <span>Subtotal</span>
              <span>${ticket.subtotal.toFixed(2)}</span>
            </div>
            <div className="ticket-row">
              <span>IVA (16%)</span>
              <span>${ticket.iva.toFixed(2)}</span>
            </div>
            {ticket.discount > 0 && (
              <div className="ticket-row">
                <span>Descuento</span>
                <span className="discount">- ${ticket.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="ticket-total">
              <span>Total pagado </span>
              <span>${ticket.total.toFixed(2)}</span>
            </div>
          </div>

          <button className="btn btn-block" onClick={() => onDone?.()}>
            Volver al menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout-card">
        <h2>Confirmar Pedido</h2>

        {items.length === 0 ? (
          <p className="empty-msg">No hay productos en el carrito.</p>
        ) : (
          <>
            <div className="checkout-items">
              {items.map((i) => {
                const finalPrice = getFinalPrice ? getFinalPrice(i) : (i.finalPrice || i.price);
                return (
                  <div key={i.id} className="checkout-item">
                    <span>{i.title}</span>
                    <span className="checkout-price">{i.quantity} x ${finalPrice.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="checkout-summary">
              <div className="checkout-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout-row">
                <span>IVA (16%)</span>
                <span>${iva.toFixed(2)}</span>
              </div>
              <div className="checkout-row">
                <span>Descuento</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className="checkout-total">
                <span>Total </span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {step && (
              <div className="checkout-step">
                <div className="spinner-sm" />
                <span>{step}</span>
              </div>
            )}

            {error && <p className="error-msg">{error}</p>}

            <div className="checkout-actions" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                className="btn btn-block"
                onClick={onBack}
                disabled={loading}
                style={{ background: '#95a5a6', color: 'white' }}
              >
                Volver al carrito
              </button>
              <button
                className="btn btn-block btn-primary"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Procesando..." : "Confirmar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}