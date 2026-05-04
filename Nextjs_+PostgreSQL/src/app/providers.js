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
import { GlobalToastProvider } from "@/context/GlobalToastContext";
import { SessionExpiryProvider } from "@/context/SessionExpiryContext";
import { SidebarProvider } from "@/context/SidebarContext";

export function Providers({ children, session }) {
  return (
    <SessionProvider session={session}
      // refetchInterval={33} // check every 60 seconds
      refetchOnWindowFocus={true}
    >
      {/* <SessionExpiryProvider> */}
      <ThemeProvider>
        <ReduxProvider>
          <SidebarProvider>
            <AppContextProvider>
              <GlobalToastProvider>
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
              </GlobalToastProvider>
            </AppContextProvider>
          </SidebarProvider>
        </ReduxProvider>
      </ThemeProvider>
      {/* </SessionExpiryProvider> */}
    </SessionProvider>
  );
}