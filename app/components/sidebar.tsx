'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // 1. Tambah useRouter

// --- 1. INTERFACES ---
interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  // --- BARU: Tambahkan props untuk data user ---
  username?: string; 
  role?: string;
}

interface MenuLinkProps {
  href: string;
  name: string;
  icon: React.ElementType;
  isCollapsed: boolean;
}

// --- 2. ICONS (Sama seperti sebelumnya) ---
const Icons = {
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>,
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>,
  Test: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>,
  Upload: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>,
  Help: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>,
  Moon: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>,
  Sun: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
};

// --- 3. HELPER MENU LINK ---
const MenuLink = ({ href, name, icon: Icon, isCollapsed }: MenuLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={`
        group relative flex items-center gap-3 px-4 py-3 rounded-xl mb-1
        transition-all duration-300 ease-out font-medium overflow-visible
        ${isActive 
          ? 'bg-[#6C5DD3] text-white shadow-lg shadow-purple-900/40 translate-x-0'
          : 'text-gray-400 hover:bg-[#25252d] hover:text-white'
        }
        ${isCollapsed ? 'justify-center' : ''}
      `}
    >
      <div className={`
        shrink-0 transition-transform duration-300 ease-out 
        ${!isActive && 'group-hover:scale-125 group-hover:-rotate-6 group-hover:text-[#6C5DD3]'}
      `}>
        <Icon />
      </div>
      
      <span className={`
        whitespace-nowrap transition-all duration-300 ease-out origin-left
        ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}
        ${!isActive && 'group-hover:translate-x-2'} 
      `}>
        {name}
      </span>

      {isCollapsed && (
        <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#6C5DD3] text-white text-xs font-bold rounded-lg 
          opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 
          transition-all duration-300 pointer-events-none z-50 whitespace-nowrap shadow-[0_0_15px_rgba(108,93,211,0.5)]">
          {name}
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-[#6C5DD3]"></div>
        </div>
      )}
    </Link>
  );
};

// --- 4. KOMPONEN UTAMA SIDEBAR ---
export default function Sidebar({ 
  darkMode, 
  setDarkMode, 
  isCollapsed, 
  setIsCollapsed,
  // --- BARU: Terima props username & role dengan nilai default ---
  username = "Guest User",
  role = "VISITOR" 
}: SidebarProps) {
  
  const router = useRouter(); // --- BARU: Hook routing ---

  // --- BARU: Fungsi Logout ---
  const handleLogout = () => {
    // 1. Hapus data sesi (opsional, tergantung logic login kamu)
    // localStorage.removeItem('token'); 
    // localStorage.removeItem('userData');

    // 2. Redirect ke halaman Login
    router.push('/'); // Atau '/login' jika foldernya login
  };

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen bg-[#1c1c24] flex flex-col z-20 font-medium border-r border-gray-800 
      transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl
      ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* HEADER LOGO */}
      <div className={`flex items-center h-20 border-b border-gray-800/50 transition-all duration-500 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-5'}`}>
         <div className={`overflow-hidden transition-all duration-500 flex flex-col ${isCollapsed ? 'w-0 opacity-0 absolute' : 'w-auto opacity-100 relative'}`}>
            <span className="text-white text-lg font-bold whitespace-nowrap">AdminPanel</span>
         </div>

         <button 
           onClick={() => setIsCollapsed(!isCollapsed)}
           className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800 focus:outline-none"
         >
            <Icons.Menu />
         </button>
      </div>

      {/* --- PROFIL USER DINAMIS --- */}
      <div className={`flex items-center gap-3 px-4 py-6 transition-all duration-500 ${isCollapsed ? 'justify-center flex-col' : ''}`}>
         <div className={`rounded-full bg-gray-600 overflow-hidden border-2 border-[#6C5DD3] shrink-0 transition-all duration-500 ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'}`}>
            <img src="https://www.uib.ac.id/wp-content/uploads/2024/01/Logo-UIB.png" alt="Profile" className="w-full h-full object-cover" />
         </div>
         
         <div className={`flex flex-col overflow-hidden transition-all duration-500 ${isCollapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
            {/* Ganti text statis dengan variabel props */}
            <span className="text-white text-sm font-bold whitespace-nowrap">{username}</span>
            <span className="text-[10px] text-gray-500 font-semibold tracking-wide whitespace-nowrap uppercase">{role}</span>
         </div> 
      </div>

      {/* NAVIGASI */}
      <nav className="flex-1 px-3 mt-2 overflow-y-auto custom-scrollbar space-y-1">
          <MenuLink href="/dashboard" name="Dashboard" icon={Icons.Dashboard} isCollapsed={isCollapsed} />
          <MenuLink href="/score-test" name="Score Test" icon={Icons.Test} isCollapsed={isCollapsed} />
          
          <div className={`my-4 transition-all duration-300 ${isCollapsed ? 'h-px bg-gray-800 mx-2' : 'px-4'}`}>
             {!isCollapsed && <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest animate-in fade-in">Uploads</p>}
          </div>

          <MenuLink href="/up-score-test" name="Up Score Test" icon={Icons.Upload} isCollapsed={isCollapsed} />
          <MenuLink href="/up-score-pegawai" name="Up Score Pegawai" icon={Icons.Upload} isCollapsed={isCollapsed} />
          <MenuLink href="/up-score-mandarin" name="Up Score Mandarin" icon={Icons.Upload} isCollapsed={isCollapsed} />
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-800 space-y-2">
          <button className={`flex items-center gap-3 px-2 py-2 text-gray-400 hover:text-white transition-colors w-full rounded-lg hover:bg-[#2c2c35] ${isCollapsed ? 'justify-center' : ''}`}>
             <Icons.Help /> 
             <span className={`${isCollapsed ? 'hidden' : 'block'} text-xs font-semibold whitespace-nowrap transition-all duration-300`}>Help</span>
          </button>
          
          {/* --- TOMBOL LOGOUT AKTIF --- */}
          <button 
             onClick={handleLogout} // Panggil fungsi Logout
             className={`flex items-center gap-3 px-2 py-2 text-gray-400 hover:text-red-400 transition-colors w-full rounded-lg hover:bg-[#2c2c35] ${isCollapsed ? 'justify-center' : ''}`}
          >
             <Icons.Logout /> 
             <span className={`${isCollapsed ? 'hidden' : 'block'} text-xs font-semibold whitespace-nowrap transition-all duration-300`}>Log Out</span>
          </button>
          
          {/* Toggle Dark Mode */}
          <div 
            onClick={() => setDarkMode(!darkMode)} 
            className={`flex items-center justify-between px-3 py-3 bg-[#25252d] rounded-xl mt-2 cursor-pointer hover:bg-[#2c2c35] transition-all duration-300 ${isCollapsed ? 'justify-center px-0 py-3' : ''}`}
          >
             <div className="flex items-center gap-2 text-xs text-white font-semibold">
                {darkMode ? <Icons.Moon /> : <Icons.Sun />} 
                <span className={`${isCollapsed ? 'hidden' : 'block'} whitespace-nowrap transition-all duration-300`}>{darkMode ? 'Dark' : 'Light'}</span>
             </div>
             
             {!isCollapsed && (
               <div className={`w-8 h-4 rounded-full relative shadow-inner transition-colors duration-300 ${darkMode ? 'bg-[#6C5DD3]' : 'bg-gray-500'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-300 ${
                      darkMode ? 'right-0.5' : 'left-0.5'}`}></div>
               </div>
             )}
          </div>
      </div>
    </aside>
  );
}
