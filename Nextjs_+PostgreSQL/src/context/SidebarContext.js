"use client";

import { createContext, useContext, useReducer } from "react";

const initialState = { isOpen: false };

function sidebarReducer(state, action) {
  switch (action.type) {
    case "OPEN":
      return { isOpen: true };
    case "CLOSE":
      return { isOpen: false };
    default:
      return state;
  }
}

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [state, dispatch] = useReducer(sidebarReducer, initialState);

  const openSidebar = (message = "") =>
    dispatch({ type: "OPEN" });
  const closeSidebar = () => dispatch({ type: "CLOSE" });

  const value = {
    isOpen: state.isOpen,
    openSidebar,
    closeSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return ctx;
}
