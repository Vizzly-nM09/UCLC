// 📂 app/dashboard/layout.tsx
'use client';

import React, { useState } from 'react';
import Sidebar from '../components/sidebar'; 
import { ThemeProvider, useTheme } from '@/app/context/ThemeContext'; // 1. Import Context

// Kita butuh komponen wrapper kecil untuk memisahkan Logic Context
function DashboardContent({ children }: { children: React.ReactNode }) {
  const { darkMode, setDarkMode } = useTheme(); // 2. Pakai Context
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans transition-colors duration-300 ${darkMode ? 'bg-[#1c1c24]' : 'bg-[#f4f7fe]'}`}>
      
      {/* Sidebar dikendalikan oleh Global Context sekarang */}
      <Sidebar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          username="Admin UIB" 
          role="SUPER ADMIN"
      />

      <div className={`flex-1 flex flex-col h-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] 
          ${isCollapsed ? 'ml-20' : 'ml-64'}`
      }>
        <div className={`flex-1 m-0 flex flex-col min-w-0 overflow-hidden relative shadow-[-10px_0_30px_rgba(0,0,0,0.3)] rounded-l-[40px] 
            ${darkMode ? 'bg-[#13131a]' : 'bg-[#f4f7fe]'}`
        }>
            <main className="flex-1 overflow-y-auto min-w-0">
               {children} 
            </main>
        </div>
      </div>
    </div>
  );
}

// Export Default Utama
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    // 3. Bungkus semuanya dengan Provider
    <ThemeProvider>
      <DashboardContent>{children}</DashboardContent>
    </ThemeProvider>
  );
}