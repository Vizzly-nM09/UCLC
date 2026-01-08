'use client'; 

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react'; // ✅ Import Session
import Sidebar from '../components/sidebar'; 
import { Bar } from 'react-chartjs-2';
import toast, { Toaster } from 'react-hot-toast';

// ✅ Import Komponen yang sudah dipisah
import { StatCard } from '../components/dashboard/stat-card';
import { StudentsTable, initialDummyData } from '../../components/ui/table/student-table';

// ✅ Import Icons langsung di sini atau buat file terpisah juga boleh
// (Saya singkat disini agar rapi)
const Icons = {
    Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Score: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Filter: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
};

// ... (Import ChartJS register code tetap ada, disingkat disini) ...
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


export default function Dashboard() {
  // ✅ AMBIL DATA SESSION (Nama User)
  const { data: session } = useSession(); 
  
  const [isClient, setIsClient] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default Dark Mode biar keren
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  // State Filter & Router (Sama seperti sebelumnya)
  const [filterInputs, setFilterInputs] = useState({ prodi: 'Semua Program Studi', tahun: 'Semua Tahun', minScore: '' });
  const [activeFilters, setActiveFilters] = useState({ prodi: 'Semua Program Studi', tahun: 'Semua Tahun', minScore: '' });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => { 
      setIsClient(true); 
      // ... Load Local Storage Logic ...
      const localData = JSON.parse(localStorage.getItem('studentsData') || '[]');
      setStudents([...localData, ...initialDummyData]);
      
      // ✅ Toast Login dengan Nama User
      if (searchParams.get('login') === 'success') {
          // Ambil nama dari session (kalau belum load, pakai 'Admin')
          const userName = session?.user?.name || "Admin";
          toast.success(`Selamat datang kembali, ${userName}!`, {
              id: 'login-success',
              duration: 4000,
              style: {
                  background: '#25252d',
                  color: '#fff',
                  border: '1px solid #6C5DD3',
              },
              icon: '👋',
          });
          router.replace('/dashboard'); 
          setHasSearched(true); 
      } 
  }, [searchParams, router, session]); // Add session dependency

  // ... (Logic Filtering, Sorting, Stats, ChartData SAMA PERSIS dengan file lamamu) ...
  // (Saya skip bagian ini agar jawaban tidak terlalu panjang, copy paste logic filteredStudents, stats, chartDataComputed, chartOptions dari file lamamu kesini)

  const handleTampilkan = () => {
    // ... logic sama ...
    setHasSearched(true);
    setActiveFilters(filterInputs);
  };
  
  // Logic Dummy Filtered Students & Stats & Charts (PASTIKAN KODE INI ADA DARI FILE LAMAMU)
  const filteredStudents = useMemo(() => students, [students]); // Placeholder biar ga error
  const stats = { total: 0, avg: 0, passRate: 0 }; // Placeholder
  const chartDataComputed = { labels: [], datasets: [] }; // Placeholder
  const chartOptions = {}; // Placeholder

  return (
    <div className={`flex h-screen w-full ${darkMode ? 'bg-[#121212]' : 'bg-gray-50'} overflow-hidden font-sans transition-colors duration-300`}>
      <Toaster position="top-right" />

      {/* ✅ Pass Username ke Sidebar */}
      <Sidebar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          username={session?.user?.name || "Memuat..."} 
          role="ADMINISTRATOR"
      />

      <div className={`flex-1 flex flex-col h-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* Container Utama dengan Rounding yang Modern */}
        <div className={`flex-1 m-2 rounded-[30px] overflow-hidden relative shadow-2xl flex flex-col ${darkMode ? 'bg-[#1c1c24]' : 'bg-white'}`}>
            
            <main className="flex-1 overflow-y-auto p-8 space-y-8">
                
                {/* Header Page yang Lebih Cantik */}
                <div className="flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-700">
                    <div>
                        <h1 className={`text-3xl font-bold tracking-tight mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                           Dashboard Analitik
                        </h1>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                           Pantau performa nilai bahasa Inggris mahasiswa UIB secara realtime.
                        </p>
                    </div>
                    {/* Hiasan Tanggal */}
                    <div className={`px-4 py-2 rounded-xl text-xs font-semibold border ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'}`}>
                       {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* Filter Section (Desain Diperhalus) */}
                <div className={`p-6 rounded-2xl border transition-all duration-300 ${darkMode ? 'bg-[#25252d] border-gray-700/50' : 'bg-gray-50 border-gray-200'}`}>
                   {/* ... Isi Filter UI sama seperti lamamu, tapi container luarnya saya rapikan ... */}
                   {/* Tombol Tampilkan saya sarankan diperbesar sedikit paddingnya */}
                   <button onClick={handleTampilkan} className="w-full mt-4 py-3 bg-gradient-to-r from-[#6C5DD3] to-[#8B72EA] text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 hover:scale-[1.01] active:scale-95 transition-all">
                      Tampilkan Data Terbaru
                   </button>
                </div>

                {/* CONTENT AREA */}
                {hasSearched ? (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <StatCard title="Total Mahasiswa Terdata" value={stats.total} icon={Icons.Users} color="bg-blue-500" darkMode={darkMode} />
                            <StatCard title="Rata-rata Skor Keseluruhan" value={stats.avg} icon={Icons.Score} color="bg-[#6C5DD3]" darkMode={darkMode} />
                            <StatCard title="Persentase Kelulusan" value={stats.passRate} icon={Icons.Check} color="bg-teal-500" isPercent darkMode={darkMode} />
                        </div>

                        {/* Chart & Table */}
                        <div className="grid grid-cols-1 gap-6">
                           <div className={`rounded-2xl border p-6 shadow-sm ${darkMode ? 'bg-[#25252d] border-gray-700/50' : 'bg-white border-gray-100'}`}>
                               <h2 className={`text-base font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Grafik Tren Bulanan</h2>
                               <div className="h-80 w-full relative">
                                   {isClient ? <Bar data={chartDataComputed} options={chartOptions as any} /> : null}
                               </div>
                           </div>
                           
                           {/* Table */}
                           <div className="rounded-2xl overflow-hidden border border-gray-700/50">
                             <StudentsTable 
                                data={filteredStudents} 
                                // ... props lain ...
                                darkMode={darkMode} 
                             />
                           </div>
                        </div>
                    </div>
                ) : (
                    // Empty State yang lebih menarik
                    <div className="flex flex-col items-center justify-center h-64 opacity-50">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                           <Icons.Filter />
                        </div>
                        <p className="text-gray-400">Pilih filter di atas untuk memulai analisis data.</p>
                    </div>
                )}
            </main>
        </div>
      </div>
    </div>
  );
}