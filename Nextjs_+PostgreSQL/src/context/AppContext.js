"use client";

import { useRef, createContext, useState, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const router = useRouter();


  const value = useMemo(() => ({}), []);


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
