import { useState, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "Todas",
  "hamburguesas",
  "papas",
  "pizzas",
  "alitas",
  "bebidas",
  "postres",
  "combos",
];

export default function Catalog({ products }) {
  const { dispatch, items } = useCart();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("");
  const [qty, setQty] = useState({});
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const cartMap = useMemo(() => {
    const map = {};
    for (const i of items) map[i.id] = i.quantity;
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (category !== "Todas") {
      result = result.filter((p) => p.category === category);
    }

    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "name-desc") result.sort((a, b) => b.title.localeCompare(b.title));

    return result;
  }, [products, search, category, sort]);

  function getStock(product) {
    return product.rating?.count ?? product.stock ?? 0;
  }

  function getAvailable(product) {
    const inCart = cartMap[product.id] || 0;
    return Math.max(0, getStock(product) - inCart);
  }

  function getFinalPrice(product) {
    const discount = product.discount || 0;
    return discount > 0 ? product.price * (1 - discount / 100) : product.price;
  }

  function getQty(productId) {
    return qty[productId] ?? 1;
  }

  function handleAdd(product) {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    const selected = getQty(product.id);
    const finalPrice = getFinalPrice(product);
    
    dispatch({
      type: "ADD_ITEM",
      payload: { 
        ...product, 
        quantity: selected,
        finalPrice
      }
    });
    setQty((prev) => ({ ...prev, [product.id]: 1 }));
  }

  return (
    <div className="catalog">
      <div className="catalog-controls">
        <input
          type="text"
          className="input"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className="input"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Ordenar por...</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="name-asc">Nombre: A-Z</option>
          <option value="name-desc">Nombre: Z-A</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-msg">No se encontraron productos.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => {
            const stock = getStock(p);
            const available = getAvailable(p);
            const selected = getQty(p.id);
            const inCart = cartMap[p.id] || 0;
            const finalPrice = getFinalPrice(p);
            const hasDiscount = p.discount > 0;

            return (
              <div key={p.id} className="product-card">
                <img
                  src={p.image}
                  alt={p.title}
                  className="product-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="product-img-fallback">
                  <span>{p.title.charAt(0)}</span>
                </div>
                <div className="product-body">
                  <h3 className="product-title">{p.title}</h3>
                  <span className="product-category">{p.category}</span>
                  <div className="product-meta">
                    <div>
                      {hasDiscount ? (
                        <>
                          <span className="product-price" style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>
                            ${p.price.toFixed(2)}
                          </span><br />
                          <span style={{ color: '#e74c3c', fontWeight: '700', fontSize: '20px' }}>
                            ${finalPrice.toFixed(2)}
                          </span>
                          <span style={{ color: '#27ae60', fontSize: '13px' }}> (-{p.discount}%)</span>
                        </>
                      ) : (
                        <span className="product-price">${p.price.toFixed(2)}</span>
                      )}
                    </div>
                    <span className="product-rating">
                      ★ {p.rating?.rate ?? "N/A"}
                    </span>
                  </div>
                  <span className="product-stock">
                    Stock: {stock} {inCart > 0 && `(${inCart} en carrito)`}
                  </span>

                  {available > 0 ? (
                    <div className="qty-selector">
                      <button
                        className="btn btn-sm"
                        disabled={selected <= 1}
                        onClick={() =>
                          setQty((prev) => ({
                            ...prev,
                            [p.id]: Math.max(1, selected - 1),
                          }))
                        }
                      >
                        −
                      </button>
                      <span className="qty-value">{selected}</span>
                      <button
                        className="btn btn-sm btn-success"
                        disabled={selected >= available}
                        onClick={() =>
                          setQty((prev) => ({
                            ...prev,
                            [p.id]: Math.min(available, selected + 1),
                          }))
                        }
                      >
                        +
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleAdd(p)}
                        disabled={!user}
                      >
                        {user ? "Agregar" : "Inicia sesión"}
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn-sm" disabled>
                      Sin stock
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showLoginPrompt && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>¡Inicia sesión para continuar!</h3>
            <p>Debes iniciar sesión para agregar productos al carrito.</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowLoginPrompt(false)}>
                Cancelar
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setShowLoginPrompt(false);
                  window.location.hash = "login"; 
                }}
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}