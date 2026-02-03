"use client";

import { useRef, createContext, useState, useContext, useMemo } from "react";
import useOnClickOutside from "../components/useOnClickOutside";
import { useRouter } from "next/navigation";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartBtnHovered, setIsCartBtnHovered] = useState(false);
  const [isProductPageArrowDown1, setIsProductPageArrowDown1] = useState(true);
  const [isProductPageArrowDown2, setIsProductPageArrowDown2] = useState(true);
  const [isSearchBtnClicked, setIsSearchBtnClicked] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);


  const menuBtnRef = useRef(null);
  const menuRef = useRef(null);
  const searchBarRef = useRef(null);
  const smallCartBoxRef = useRef(null);

  // Close Menu when clicking outside
  useOnClickOutside(menuBtnRef, menuRef, () => setIsMenuOpen(false), isMenuOpen);

  const value = useMemo(() => ({
    router,
    isMenuOpen,
    setIsMenuOpen,
    isSearchBarOpen,
    setIsSearchBarOpen,
    isCartBtnHovered,
    setIsCartBtnHovered,
    isProductPageArrowDown1,
    setIsProductPageArrowDown1,
    isProductPageArrowDown2,
    setIsProductPageArrowDown2,
    menuBtnRef,
    menuRef,
    searchBarRef,
    smallCartBoxRef,
  }), [
    router,
    isMenuOpen,
    isSearchBarOpen,
    isCartBtnHovered,
    isProductPageArrowDown1,
    isProductPageArrowDown2
  ]);


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
