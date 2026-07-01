import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const STORAGE_KEY = "fastfood_cart";

function loadCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function getItemStock(item) {
  return item?.rating?.count ?? item?.stock ?? Infinity;
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { quantity = 1, ...product } = action.payload;
      const existing = state.find((i) => i.id === product.id);
      if (existing) {
        return state.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...state, { ...product, quantity }];
    }
    case "REMOVE_ITEM":
      return state.filter((i) => i.id !== action.payload);
    case "UPDATE_QUANTITY":
    case "SET_QUANTITY":
      return state.map((i) =>
        i.id === action.payload.id
          ? { 
              ...i, 
              quantity: Math.max(1, Math.min(action.payload.quantity, getItemStock(i))) 
            }
          : i
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Precio original del producto (sin descuento)
  const getOriginalPrice = (item) => item.price || 0;

  // Precio final con descuento por producto
  const getFinalPrice = (item) => {
    const basePrice = item.finalPrice || item.price || 0;
    const productDiscount = item.discount || 0;
    return basePrice * (1 - productDiscount / 100);
  };

  // Subtotal = suma de precios ORIGINALES (sin descuentos por producto)
  const subtotal = items.reduce((sum, i) => sum + getOriginalPrice(i) * i.quantity, 0);

  const iva = subtotal * 0.16;

  // Descuento general de la tienda
  const storeDiscount = subtotal >= 500 ? subtotal * 0.1 : subtotal >= 200 ? subtotal * 0.05 : 0;

  // Descuento total por productos
  const productsDiscount = items.reduce((sum, i) => {
    const original = getOriginalPrice(i) * i.quantity;
    const final = getFinalPrice(i) * i.quantity;
    return sum + (original - final);
  }, 0);

  const totalDiscount = storeDiscount + productsDiscount;
  const total = subtotal + iva - totalDiscount;

  const value = { 
    items, 
    dispatch, 
    subtotal, 
    iva, 
    discount: totalDiscount,   // Descuento total (tienda + productos)
    total,
    getStock: getItemStock,
    getFinalPrice,
    getOriginalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}