"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const WindowSizeContext = createContext();

export function WindowSizeProvider({ children }) {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <WindowSizeContext.Provider value={{ windowWidth }}>
      {children}
    </WindowSizeContext.Provider>
  );
}

export function useWindowSizeContext() {
  return useContext(WindowSizeContext);
}