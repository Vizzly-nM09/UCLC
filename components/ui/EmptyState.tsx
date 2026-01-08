'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeContext'; 

interface EmptyStateProps {
  title: string;
  description: string;
  badge?: string;
  actionLink?: string;
}

export default function EmptyState({ 
  title, 
  description, 
  badge = "COMING SOON",
  actionLink = "/dashboard"
}: EmptyStateProps) {
  
  const { darkMode } = useTheme();

  return (
    <div className={`relative w-full h-[85vh] flex items-center justify-center overflow-hidden rounded-3xl border transition-all duration-500
      ${darkMode ? 'bg-[#14141e] border-gray-800' : 'bg-slate-50 border-gray-200'}
    `}>
      
      {/* --- BACKGROUND ANIMATION (Aurora Effect) --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Blob Ungu */}
        <div className={`absolute top-10 -left-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob 
            ${darkMode ? 'bg-purple-900' : 'bg-purple-300'}
        `}></div>
        {/* Blob Biru */}
        <div className={`absolute top-10 -right-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000
            ${darkMode ? 'bg-blue-900' : 'bg-cyan-300'}
        `}></div>
        {/* Blob Pink */}
        <div className={`absolute -bottom-20 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000
            ${darkMode ? 'bg-pink-900' : 'bg-pink-300'}
        `}></div>
      </div>

      {/* --- CONTENT CARD (Glassmorphism) --- */}
      <div className={`relative z-10 p-10 md:p-14 text-center rounded-3xl border backdrop-blur-xl shadow-2xl max-w-xl mx-4
         ${darkMode 
            ? 'bg-white/5 border-white/10 text-white' 
            : 'bg-white/70 border-white/60 text-gray-800'
         }
      `}>
        
        {/* Badge Berkedip */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg ring-1 ring-white/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          {badge}
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-400">
            {darkMode ? <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">{title}</span> : <span className="text-gray-900">{title}</span>}
        </h2>
        
        <p className={`text-base md:text-lg mb-10 leading-relaxed font-medium
           ${darkMode ? 'text-gray-400' : 'text-gray-600'}
        `}>
          {description}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={actionLink} className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg
               ${darkMode 
                 ? 'bg-white text-black hover:bg-gray-200' 
                 : 'bg-black text-white hover:bg-gray-800'
               }
            `}>
              Kembali ke Dashboard
            </Link>
            
            <button className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold border transition-all hover:scale-105 active:scale-95
               ${darkMode
                 ? 'border-gray-700 hover:bg-white/5 text-gray-300'
                 : 'border-gray-300 hover:bg-black/5 text-gray-700'
               }
            `}>
              Notifikasi Saya
            </button>
        </div>
      </div>
    </div>
  );
}