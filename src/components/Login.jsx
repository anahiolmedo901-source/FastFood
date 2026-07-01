import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const API = "https://dummyjson.com/users";

export default function Login({ onSuccess }) {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buscarUsuario = async () => {
    const respuesta = await fetch(API);

    if (!respuesta.ok) {
      throw new Error("No fue posible consultar la API");
    }

    const datos = await respuesta.json();

    return datos.users.find(
      (usuario) =>
        usuario.username.toLowerCase() === username.toLowerCase()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const usuario = await buscarUsuario();

      if (usuario) {
        login(usuario);
        onSuccess();
      } else {
        setError("Usuario no encontrado");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="login-logo">
          🍔
        </div>

        <h1>FastFood</h1>

        <p>
          Bienvenido de nuevo
        </p>

        <form onSubmit={handleSubmit}>

          <label>Usuario</label>

          <input
            type="text"
            placeholder="Escribe tu usuario..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>

        </form>

      </div>

    </div>
  );
}