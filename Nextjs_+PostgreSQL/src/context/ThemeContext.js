"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("system"); // light | dark | system

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (selectedTheme) => {
      if (selectedTheme === "dark") {
        root.classList.add("dark");
      } else if (selectedTheme === "light") {
        root.classList.remove("dark");
      } else {
        // system
        root.classList.toggle("dark", mediaQuery.matches);
      }
    };

    applyTheme(theme);

    // 🔥 Listen for system changes
    const handleChange = (e) => {
      if (theme === "system") {
        root.classList.toggle("dark", e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);