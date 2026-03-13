"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";

const FooterContext = createContext();

export function FooterProvider({ children }) {
  const footerRef = useRef(null);
  const [footerDistance, setFooterDistance] = useState(0);

  const updateFooterDistance = () => {
    if (!footerRef.current) return;

    const rect = footerRef.current.getBoundingClientRect();
    const distance = window.innerHeight - rect.top;
    console.log("footer distance - ", distance);

    setFooterDistance(distance);
  };

  useEffect(() => {
    updateFooterDistance();

    window.addEventListener("resize", updateFooterDistance);
    window.addEventListener("scroll", updateFooterDistance);

    return () => {
      window.removeEventListener("resize", updateFooterDistance);
      window.removeEventListener("scroll", updateFooterDistance);
    };
  }, []);

  return (
    <FooterContext.Provider
      value={{
        footerRef,
        footerDistance,
      }}
    >
      {children}
    </FooterContext.Provider>
  );
}

export function useFooter() {
  return useContext(FooterContext);
}