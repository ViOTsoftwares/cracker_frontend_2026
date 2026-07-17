import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../api/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const STORAGE_KEY = "crackers_cart";

const getInitialState = (): CartState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.items)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to parse cart from localStorage", error);
  }
  return { items: [] };
};

const initialState: CartState = getInitialState();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const exists = state.items.find((item) => item.product._id === action.payload._id);
      if (exists) {
        exists.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product._id !== action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    increment: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.product._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    decrement: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.product._id === action.payload);
      if (item) {
        item.quantity = Math.max(1, item.quantity - 1);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart, increment, decrement, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
