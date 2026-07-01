import { useEffect, useState } from "react";
import foodProducts from "../data/foodProducts";

async function fetchProducts() {
  await new Promise((r) => setTimeout(r, 1500));
  return foodProducts;
}

export default function SplashScreen({ onReady }) {
  const [progress, setProgress] = useState("Cargando...");
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setProgress("Obteniendo menú...");
        const products = await fetchProducts();
        if (cancelled) return;

        setProgress("Listo!");
        await new Promise((r) => setTimeout(r, 2000));
        if (cancelled) return;

        onReady(products);
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [onReady]);

  if (error) {
    return (
      <div className="splash">
        <div className="splash-card error-card">
          <span className="splash-icon">&#9888;</span>
          <h2>Error de conexión</h2>
          <p>{error}</p>
          <button className="btn" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="splash">
      <div className="splash-card">
        <div className="splash-logo">
          <span className="splash-icon">&#127839;</span>
        </div>
        <h1>FastFood</h1>
        <p className="splash-subtitle">Tu pedido en un instante</p>
        <div className="spinner" />
        <p className="splash-progress">{progress}</p>
      </div>
    </div>
  );
}
