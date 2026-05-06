"use client";

import { createContext, useContext, useReducer } from "react";

const initialState = {
  isOpen: false,
};

function searchModalReducer(state, action) {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "TOGGLE":
      return { ...state, isOpen: !state.isOpen };
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
  const value = {
    isOpen: state.isOpen,
    openSearchModal,
    closeSearchModal,
    toggleSearchModal,
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