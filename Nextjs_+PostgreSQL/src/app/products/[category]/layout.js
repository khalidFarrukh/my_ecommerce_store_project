"use client"
import React, { createContext, useContext, useEffect, useState } from "react";

const ProductsContext = createContext([]);

export function useProducts() {
  return useContext(ProductsContext);
}


export default function CategoryLayout({ children, params }) {
  const { category } = React.use(params);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/category/" + category)
      .then(res => res.json())
      .then((data) => {
        setProducts(data);
        console.log(data);
      });
  }, [category]);

  return (
    <ProductsContext.Provider value={products}>
      {children}
    </ProductsContext.Provider>
  )
}
