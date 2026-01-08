// 📂 app/context/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Cek local storage biar user refresh halaman, dark mode gak hilang
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = (value: boolean) => {
    setDarkMode(value);
    localStorage.setItem('theme', value ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode: toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook biar gampang dipanggil di mana aja
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}