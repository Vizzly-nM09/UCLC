// 📂 app/dashboard/layout.tsx
'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/sidebar'; 
import { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useTheme } from '../context/ThemeContext'; // Import context

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { darkMode, toggleDarkMode } = useTheme(); // Gunakan context global
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    // Gunakan class standar tailwind 'bg-background' dan 'text-foreground'.
    // Class ini otomatis berubah warnanya sesuai globals.css saat ada class 'dark' di html.
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden transition-colors duration-300">
      <Toaster position="top-right" />

      {/* Sidebar */}
      {/* Pastikan Sidebar menerima props yang benar atau handle logic darkmode di dalam Sidebar menggunakan useTheme juga */}
      <Sidebar 
          darkMode={darkMode} 
          setDarkMode={toggleDarkMode} // Pass fungsi toggle dari context
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          username={session?.user?.name || "Pengguna"} 
          role="ADMIN"
      />

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Wrapper untuk konten yang bisa di-scroll */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth"> 
           {children}
        </div>
      </main>
    </div>
  );
}