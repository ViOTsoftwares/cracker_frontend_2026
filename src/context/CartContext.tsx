import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { Product } from "../api/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; productId: string }
  | { type: "INCREMENT"; productId: string }
  | { type: "DECREMENT"; productId: string }
  | { type: "CLEAR" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD": {
      const exists = state.items.find((i) => i.product._id === action.product._id);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.product._id === action.product._id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { product: action.product, quantity: 1 }] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.product._id !== action.productId) };
    case "INCREMENT":
      return {
        items: state.items.map((i) =>
          i.product._id === action.productId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    case "DECREMENT":
      return {
        items: state.items.map((i) =>
          i.product._id === action.productId
            ? { ...i, quantity: Math.max(1, i.quantity - 1) }
            : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
};

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "crackers_cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const saved = localStorage.getItem(STORAGE_KEY);
  const initial: CartState = saved ? JSON.parse(saved) : { items: [] };

  const [state, dispatch] = useReducer(cartReducer, initial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, i) => sum + i.product.offerPrice * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems,
        totalPrice,
        addToCart: (product) => dispatch({ type: "ADD", product }),
        removeFromCart: (productId) => dispatch({ type: "REMOVE", productId }),
        increment: (productId) => dispatch({ type: "INCREMENT", productId }),
        decrement: (productId) => dispatch({ type: "DECREMENT", productId }),
        clearCart: () => dispatch({ type: "CLEAR" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
