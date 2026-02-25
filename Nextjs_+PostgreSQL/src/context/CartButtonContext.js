"use client";

import { createContext, useContext, useState } from "react";

const CartButtonContext = createContext(null);

export function CartButtonProvider({ children }) {
  const [isCartBtnHovered, setIsCartBtnHovered] = useState(false);

  const value = {
    isCartBtnHovered,
    setIsCartBtnHovered,
  };

  return (
    <CartButtonContext.Provider value={value}>
      {children}
    </CartButtonContext.Provider>
  );
}

export function useCartButtonContext() {
  const ctx = useContext(CartButtonContext);
  if (!ctx) {
    throw new Error("useCartButtonContext must be used within CartButtonProvider");
  }
  return ctx;
}
