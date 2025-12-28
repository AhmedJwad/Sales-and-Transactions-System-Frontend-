
import React, { createContext, useContext, useEffect, useState } from "react";
import { Currency, CurrencyCode } from "../types/Currency";


interface CurrencyContextType {
    currency:CurrencyCode,
    setCurrency:(Currency:CurrencyCode)=> void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider:React.FC<{children:React.ReactNode}>=({children})=>{
    const[currency , setCurrency]=useState<CurrencyCode>(()=>{
        return(localStorage.getItem("currency") as CurrencyCode)
    });

    useEffect(()=>{
    localStorage.setItem("currency", currency)
    },[currency]);
    return(
        <CurrencyContext.Provider value={{currency, setCurrency}}>
            {children}
        </CurrencyContext.Provider>
    );
};
export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
};

