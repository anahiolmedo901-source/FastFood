import { useState, useCallback } from "react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import Catalog from "./components/Catalog";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Checkout from "./components/Checkout";
import "./App.css";

function AppContent() {
  const [products, setProducts] = useState(null);
  const [tab, setTab] = useState("catalog");
  const { user, logout } = useAuth();

  const handleProductsReady = useCallback((data) => {
    setProducts(data);
  }, []);

  const handleLogout = () => {
    logout();
    setTab("catalog");
  };

  const handleCheckoutDone = () => {
    setTab("catalog");
  };

  if (!products) {
    return <SplashScreen onReady={handleProductsReady} />;
  }

  return (
    <div className="app">
      <Navbar
        activeTab={tab}
        onTabChange={setTab}
        onLogout={handleLogout}
      />
      <main className="main">
        {tab === "catalog" && <Catalog products={products} />}
        
        {tab === "cart" && user && (
          <>
            <Cart products={products} />
            <div className="checkout-action">
              <button
                className="btn btn-primary btn-block"
                onClick={() => setTab("checkout")}
              >
                Finalizar Compra
              </button>
            </div>
          </>
        )}
        {tab === "cart" && !user && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <h2>Acceso restringido</h2>
            <p>Debes iniciar sesión para ver tu carrito.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => setTab("login")}
              style={{ marginTop: '20px' }}
            >
              Iniciar Sesión
            </button>
          </div>
        )}

        {tab === "login" && (
          <Login onSuccess={() => setTab("catalog")} />
        )}

        {tab === "checkout" && user && (
          <Checkout 
            products={products} 
            onDone={handleCheckoutDone} 
            onBack={() => setTab("cart")} 
          />
        )}
        {tab === "checkout" && !user && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <h2>Acceso restringido</h2>
            <p>Debes iniciar sesión para finalizar tu compra.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => setTab("login")}
              style={{ marginTop: '20px' }}
            >
              Iniciar Sesión
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;