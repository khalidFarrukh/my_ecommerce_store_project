"use client";

import { createContext, useContext, useReducer } from "react";

const initialState = { isOpen: false, message: "" };

function alertModalReducer(state, action) {
  switch (action.type) {
    case "OPEN":
      return { isOpen: true, message: action.payload ?? "" };
    case "CLOSE":
      return { isOpen: false, message: "" };
    default:
      return state;
  }
}

const AlertModalContext = createContext(null);

export function AlertModalProvider({ children }) {
  const [state, dispatch] = useReducer(alertModalReducer, initialState);

  const openAlertModal = (message = "") =>
    dispatch({ type: "OPEN", payload: message });
  const closeAlertModal = () => dispatch({ type: "CLOSE" });

  const value = {
    isOpen: state.isOpen,
    message: state.message,
    openAlertModal,
    closeAlertModal,
  };

  return (
    <AlertModalContext.Provider value={value}>
      {children}
    </AlertModalContext.Provider>
  );
}

export function useAlertModal() {
  const ctx = useContext(AlertModalContext);
  if (!ctx) {
    throw new Error("useAlertModal must be used within AlertModalProvider");
  }
  return ctx;
}
