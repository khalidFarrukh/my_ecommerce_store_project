"use client";

import { createContext, useContext, useState } from "react";

const ProductPageContext = createContext(null);

export function ProductPageProvider({ children }) {
  const [isProductPageArrowDown1, setIsProductPageArrowDown1] = useState(true);
  const [isProductPageArrowDown2, setIsProductPageArrowDown2] = useState(true);

  const value = {
    isProductPageArrowDown1,
    setIsProductPageArrowDown1,
    isProductPageArrowDown2,
    setIsProductPageArrowDown2,
  };

  return (
    <ProductPageContext.Provider value={value}>
      {children}
    </ProductPageContext.Provider>
  );
}

export function useProductPageContext() {
  const ctx = useContext(ProductPageContext);
  if (!ctx) {
    throw new Error("useProductPageContext must be used within ProductPageProvider");
  }
  return ctx;
}
