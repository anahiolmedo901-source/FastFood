import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ activeTab, onTabChange, onLogout }) {
  const { items } = useCart();
  const { user } = useAuth();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand" onClick={() => onTabChange("catalog")}>
          <span>🍔</span> FastFood
        </div>
        
        <div className="navbar-links">
          <button
            className={`nav-btn ${activeTab === "catalog" ? "active" : ""}`}
            onClick={() => onTabChange("catalog")}
          >
            Menú
          </button>
          
          {user && (
            <button
              className={`nav-btn ${activeTab === "cart" ? "active" : ""}`}
              onClick={() => onTabChange("cart")}
            >
              Carrito 
              {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </button>
          )}

          {user ? (
            <div className="nav-user">
              <span className="nav-username">{user.firstName || user.username}</span>
              <button className="nav-btn" onClick={onLogout}>
                Salir
              </button>
            </div>
          ) : (
            <button
              className={`nav-btn ${activeTab === "login" ? "active" : ""}`}
              onClick={() => onTabChange("login")}
            >
              Ingresar
            </button>
          )}
        </div>
      </nav>

      {/* Mini Cart Flotante - Solo si hay sesión iniciada */}
      {user && totalItems > 0 && (
        <button 
          className="floating-cart"
          onClick={() => onTabChange("cart")}
          title="Ver carrito"
        >
          🛒
          <span className="badge">{totalItems}</span>
        </button>
      )}
    </>
  );
}