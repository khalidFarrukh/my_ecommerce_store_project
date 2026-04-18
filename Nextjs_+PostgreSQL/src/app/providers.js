"use client";

import { AppContextProvider } from "@/context/AppContext";
import ReduxProvider from "@/providers/ReduxProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { SessionProvider } from "next-auth/react";
import { SearchModalProvider } from "@/context/SearchModalContext";
import { AlertModalProvider } from "@/context/AlertModalContext";
import { CartButtonProvider } from "@/context/CartButtonContext";
import { ProductPageProvider } from "@/context/ProductPageContext";
import { WindowSizeProvider } from "@/context/WindowSizeContext";
import { CategoriesContextProvider } from "@/context/CategoriesContext";

export function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <ReduxProvider>
          <AppContextProvider>
            <CategoriesContextProvider>
              <SearchModalProvider>
                <AlertModalProvider>
                  <CartButtonProvider>
                    <ProductPageProvider>
                      <WindowSizeProvider>
                        {children}
                      </WindowSizeProvider>
                    </ProductPageProvider>
                  </CartButtonProvider>
                </AlertModalProvider>
              </SearchModalProvider>
            </CategoriesContextProvider>
          </AppContextProvider>
        </ReduxProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}