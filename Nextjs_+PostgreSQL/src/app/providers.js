"use client";

import { AppContextProvider } from "@/context/AppContext";
import ReduxProvider from "@/providers/ReduxProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { SessionProvider } from "next-auth/react";
import { SearchModalProvider } from "@/context/SearchModalContext";
import { AlertModalProvider } from "@/context/AlertModalContext";
import { CartButtonProvider } from "@/context/CartButtonContext";
import { ProductPageProvider } from "@/context/ProductPageContext";

export function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <ReduxProvider>
          <AppContextProvider>
            <SearchModalProvider>
              <AlertModalProvider>
                <CartButtonProvider>
                  <ProductPageProvider>
                    {children}
                  </ProductPageProvider>
                </CartButtonProvider>
              </AlertModalProvider>
            </SearchModalProvider>
          </AppContextProvider>
        </ReduxProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}