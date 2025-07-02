import { createContext, useState, useMemo, useContext, ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import type { Theme } from "@mui/material";
import { lightTheme, darkTheme } from "./themes";

interface ThemeContextProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Crear el contexto
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useThemeContext = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useThemeContext must be used within a CustomThemeProvider"
    );
  }
  return context;
};

interface CustomThemeProviderProps {
  children: ReactNode;
}

// Proveedor del contexto del tema
export const CustomThemeProvider = ({ children }: CustomThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Función para cambiar entre temas
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle("dark", !isDarkMode); // Esto cambia las clases en el <html>
  };

  // Crear el tema dependiendo del modo
  const theme: Theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode]
  );

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};