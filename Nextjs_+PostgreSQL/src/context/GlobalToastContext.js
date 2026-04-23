import { createContext, useContext, useState } from "react";

const GlobalToastContext = createContext();

export function GlobalToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  return (
    <GlobalToastContext.Provider value={{ toast, setToast }}>
      {children}
    </GlobalToastContext.Provider>
  );
}

export const useGlobalToast = () => useContext(GlobalToastContext);