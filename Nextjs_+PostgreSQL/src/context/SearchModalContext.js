"use client";

import { createContext, useContext, useReducer } from "react";

const initialState = {
  isOpen: false,
  searchedProducts: {}, // { query: [products] }
};

function searchModalReducer(state, action) {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };
    case "SET_SEARCHED_PRODUCTS":
      return {
        ...state,
        searchedProducts: {
          ...state.searchedProducts,
          [action.query]: action.products,
        },
      };
    default:
      return state;
  }
}

const SearchModalContext = createContext(null);

export function SearchModalProvider({ children }) {
  const [state, dispatch] = useReducer(searchModalReducer, initialState);

  const openSearchModal = () => dispatch({ type: "OPEN" });
  const closeSearchModal = () => dispatch({ type: "CLOSE" });
  const toggleSearchModal = () => dispatch({ type: "TOGGLE" });
  const setSearchedProducts = (query, products) =>
    dispatch({ type: "SET_SEARCHED_PRODUCTS", query, products });

  const value = {
    isOpen: state.isOpen,
    searchedProducts: state.searchedProducts,
    openSearchModal,
    closeSearchModal,
    toggleSearchModal,
    setSearchedProducts,
  };

  return (
    <SearchModalContext.Provider value={value}>
      {children}
    </SearchModalContext.Provider>
  );
}

export function useSearchModal() {
  const ctx = useContext(SearchModalContext);
  if (!ctx) {
    throw new Error("useSearchModal must be used within SearchModalProvider");
  }
  return ctx;
}