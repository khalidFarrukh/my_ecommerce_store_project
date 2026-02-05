"use client";

import { AppContextProvider } from "@/context/AppContext";
import ReduxProvider from "@/providers/ReduxProvider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <ReduxProvider>
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}