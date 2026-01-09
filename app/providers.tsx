'use client';

import { SessionProvider } from "next-auth/react";
// 1. Import ThemeProvider yang kamu buat
import { ThemeProvider } from "./context/ThemeContext"; 

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* 2. Pasang ThemeProvider di sini */}
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}