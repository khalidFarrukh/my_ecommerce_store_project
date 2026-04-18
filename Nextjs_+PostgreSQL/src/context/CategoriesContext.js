"use client";
import React, { createContext, useContext, useState } from "react";

const CategoriesContext = createContext();

export function CategoriesContextProvider({ children }) {
  const [areCategoriesOpen, setAreCategoriesOpen] = useState(false);

  return (
    <CategoriesContext.Provider
      value={{
        areCategoriesOpen,
        setAreCategoriesOpen,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategoriesContext() {
  const context = useContext(CategoriesContext);

  if (!context) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }

  return context;
}