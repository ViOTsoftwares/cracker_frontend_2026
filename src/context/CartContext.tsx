import React from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  increment as incrementAction,
  decrement as decrementAction,
  clearCart as clearCartAction,
} from "../store/slices/cartSlice";
import type { CartItem } from "../store/slices/cartSlice";
import type { Product } from "../api/products";

export type { CartItem };

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useCart = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.product.offerPrice * i.quantity,
    0
  );

  return {
    items,
    totalItems,
    totalPrice,
    addToCart: (product: Product) => dispatch(addToCartAction(product)),
    removeFromCart: (productId: string) => dispatch(removeFromCartAction(productId)),
    increment: (productId: string) => dispatch(incrementAction(productId)),
    decrement: (productId: string) => dispatch(decrementAction(productId)),
    clearCart: () => dispatch(clearCartAction()),
  };
};
