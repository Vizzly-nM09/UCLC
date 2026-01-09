'use client';

import React, { useState } from 'react';
import Sidebar from '../components/sidebar'; // Pastikan path import benar
import { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // State dark mode global (bisa dipindah ke Context nanti)

  return (
    // Container utama: Flex Row agar Sidebar dan Konten bersebelahan
    <div className={`flex h-screen w-full ${darkMode ? 'bg-[#121212]' : 'bg-gray-50'} overflow-hidden transition-colors duration-300`}>
      <Toaster position="top-right" />

      {/* Sidebar ditaruh di sini, sekali load saja */}
      <Sidebar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          username={session?.user?.name || "Memuat..."} 
          role="ADMINISTRATOR"
      />

      {/* Konten Page (Children) */}
      {/* flex-1 artinya: Ambil semua sisa lebar yang tersedia setelah sidebar */}
      {/* Tidak perlu margin manual (ml-64) karena sudah diurus oleh Flexbox */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Kita clone element agar bisa pass props darkMode ke children (opsional jika pakai Context) */}
        {/* Untuk simplifikasi, kita render children langsung di dalam container yang bisa discroll */}
        <div className="flex-1 overflow-y-auto p-2"> 
           {/* Clone element trick atau Context API disarankan untuk passing darkMode ke page. 
               Tapi agar simpel, anggap children me-render kontennya di sini */}
           {children}
        </div>
      </main>
    </div>
  );
}