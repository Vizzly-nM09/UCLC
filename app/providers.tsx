'use client';

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/app/context/ThemeContext"; // ✅ Pastikan baris ini ada!

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* 👇 ThemeProvider harus membungkus children di sini */}
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}