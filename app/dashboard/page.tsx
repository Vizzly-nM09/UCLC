'use client'; 

import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../components/sidebar'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
// ✅ IMPORT REACT HOT TOAST
import toast, { Toaster } from 'react-hot-toast';

// ✅ IMPORT TABLE SESUAI PATH KAMU
import { StudentsTable, initialDummyData } from '../../components/ui/table/student-table';

// Registrasi Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- COMPONENT: ANIMATED NUMBER ---
const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0); 
  const startTime = useRef<number>(0);
  const startValue = useRef<number>(0); 
  const targetValue = useRef<number>(value);
  const animationFrame = useRef<number>(0);

  useEffect(() => {
    startValue.current = displayValue;
    targetValue.current = value;
    startTime.current = 0; 

    const animate = (time: number) => {
      if (!startTime.current) startTime.current = time;
      const progress = (time - startTime.current) / 1000; 

      if (progress < 1) {
        const ease = 1 - Math.pow(2, -10 * progress);
        const current = startValue.current + (targetValue.current - startValue.current) * ease;
        setDisplayValue(Math.floor(current)); 
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue.current);
      }
    };

    animationFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame.current);
  }, [value]); 

  return <span>{displayValue}</span>;
};

// --- ICONS ---
const Icons = {
    Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Score: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Filter: () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
};

// --- COMPONENT: STAT CARD ---
const StatCard = memo(({ title, value, icon: Icon, color, isPercent = false, darkMode }: any) => (
    <div className={`group relative p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden
      ${darkMode ? 'bg-[#1c1c24] border-gray-700' : 'bg-white border-white shadow-sm'}
    `}>
        <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 group-hover:scale-125 transition-transform duration-500 ${color}`}></div>
        <div className="flex items-center justify-between relative z-10">
            <div>
                <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
                <h3 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <AnimatedNumber value={value} />{isPercent && <span className="text-lg">%</span>}
                </h3>
            </div>
            <div className={`p-2.5 rounded-xl ${color} text-white shadow-md`}><Icon /></div>
        </div>
    </div>
));
StatCard.displayName = "StatCard";

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================
export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [students, setStudents] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterInputs, setFilterInputs] = useState({ prodi: 'Semua Program Studi', tahun: 'Semua Tahun', minScore: '' });
  const [activeFilters, setActiveFilters] = useState({ prodi: 'Semua Program Studi', tahun: 'Semua Tahun', minScore: '' });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // ❌ State Toast manual dihapus karena diganti React Hot Toast
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- INITIAL LOAD & EFFECT ---
  // ... (kode sebelumnya)

  // --- INITIAL LOAD & QUERY PARAMS ---
  useEffect(() => { 
      setIsClient(true); 
      
      const localData = JSON.parse(localStorage.getItem('studentsData') || '[]');
      setStudents([...localData, ...initialDummyData]);

      const initialData = { 
          prodi: searchParams.get('prodi') || 'Semua Program Studi', 
          tahun: searchParams.get('tahun') || 'Semua Tahun', 
          minScore: searchParams.get('min') || '' 
      };
      setFilterInputs(initialData); 
      setActiveFilters(initialData);
      
      // ✅ LOGIC LOGIN SUCCESS (Fixed: Prevent Duplicate)
      if (searchParams.get('login') === 'success') {
          toast.success("Login Berhasil! Selamat datang Admin.", {
              id: 'login-success', // <--- 🔑 KUNCINYA DISINI (ID UNIK)
              duration: 3000,
              position: 'top-center',
              style: {
                  background: darkMode ? '#25252d' : '#fff',
                  color: darkMode ? '#fff' : '#333',
                  border: '1px solid #22c55e',
                  padding: '16px',
                  fontWeight: 'bold',
              },
              iconTheme: {
                  primary: '#22c55e',
                  secondary: '#FFFAEE',
              },
          });
          
          router.replace('/dashboard'); 
          setHasSearched(true); 
      } 
      else if (searchParams.get('prodi') || searchParams.get('tahun') || searchParams.get('min')) {
          setHasSearched(true);
      }
  }, [searchParams, router, darkMode]);

  // --- HANDLER: TOMBOL TAMPILKAN ---
  const handleTampilkan = () => {
    const params = new URLSearchParams();
    if (filterInputs.prodi !== 'Semua Program Studi') params.set('prodi', filterInputs.prodi);
    if (filterInputs.tahun !== 'Semua Tahun') params.set('tahun', filterInputs.tahun);
    if (filterInputs.minScore) params.set('min', filterInputs.minScore);
    
    router.push(`?${params.toString()}`);
    setActiveFilters(filterInputs);
    setHasSearched(true);
    
    // ✅ TOAST NOTIFIKASI UPDATE DATA (Custom Style Ungu)
    toast.success("Data analitik diperbarui!", {
        duration: 3000,
        position: 'bottom-right',
        style: {
            background: '#6C5DD3', // Warna ungu tema kamu
            color: 'rgba(255, 255, 255, 1)',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '13px'
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#6C5DD3',
        },
    });
  };

  // --- LOGIC: FILTERING ---
  const filteredStudents = useMemo(() => {
    let data = students.filter((student) => {
        if (activeFilters.prodi !== 'Semua Program Studi' && student.prodi !== activeFilters.prodi) return false;
        const studentYear = student.date.split(' ')[2]; 
        if (activeFilters.tahun !== 'Semua Tahun' && studentYear !== activeFilters.tahun) return false;
        if (activeFilters.minScore && student.score < parseInt(activeFilters.minScore)) return false;
        return true; 
    });
    if (sortConfig !== null) {
        data.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }
    return data;
  }, [students, activeFilters, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // --- LOGIC: STATS ---
  const stats = useMemo(() => {
      const total = filteredStudents.length;
      const totalScore = filteredStudents.reduce((acc, curr) => acc + Number(curr.score), 0);
      const avg = total > 0 ? Math.round(totalScore / total) : 0;
      
      const passed = filteredStudents.filter(s => {
         if (s.type === 'TOEIC' && s.score >= 600) return true;
         if (s.type === 'TOEFL ITP' && s.score >= 500) return true;
         if (s.type === 'TOEFL iBT' && s.score >= 80) return true;
         return false;
      }).length;

      const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
      return { total, avg, passRate };
  }, [filteredStudents]);

  // --- LOGIC: CHART ---
  const chartDataComputed = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const toeicData = new Array(12).fill(0);
    const itpData = new Array(12).fill(0);
    const ibtData = new Array(12).fill(0);

    filteredStudents.forEach(student => {
        let isPassed = false;
        if (student.type === 'TOEIC' && student.score >= 600) isPassed = true;
        else if (student.type === 'TOEFL ITP' && student.score >= 500) isPassed = true;
        else if (student.type === 'TOEFL iBT' && student.score >= 80) isPassed = true;

        if (isPassed) {
            const monthStr = student.date.split(' ')[1];
            const monthIndex = months.findIndex(m => m === monthStr);
            if (monthIndex !== -1) {
                if (student.type === 'TOEIC') toeicData[monthIndex]++;
                else if (student.type === 'TOEFL ITP') itpData[monthIndex]++;
                else if (student.type === 'TOEFL iBT') ibtData[monthIndex]++;
            }
        }
    });

    return {
        labels: months,
        datasets: [
            { label: 'TOEIC', data: toeicData, backgroundColor: 'rgba(108, 93, 211, 0.8)', hoverBackgroundColor: '#6C5DD3', borderRadius: 4 },
            { label: 'ITP', data: itpData, backgroundColor: 'rgba(56, 189, 248, 0.8)', hoverBackgroundColor: '#38BDF8', borderRadius: 4 },
            { label: 'iBT', data: ibtData, backgroundColor: 'rgba(236, 72, 153, 0.8)', hoverBackgroundColor: '#EC4899', borderRadius: 4 },
        ]
    };
  }, [filteredStudents]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
        legend: { 
            position: 'top' as const, 
            align: 'end' as const, 
            labels: { 
                color: darkMode ? '#ffffff' : '#666666', 
                usePointStyle: true, 
                boxWidth: 6, 
                font: { size: 10 } 
            } 
        }, 
        title: { display: false } 
    },
    scales: { 
        x: { 
            grid: { display: false }, 
            ticks: { color: darkMode ? '#aaaaaa' : '#666666', font: { size: 10 } } 
        }, 
        y: { 
            beginAtZero: true, 
            ticks: { color: darkMode ? '#aaaaaa' : '#666666', precision: 0, font: { size: 10 } }, 
            grid: { color: darkMode ? '#333333' : '#e5e5e5', borderDash: [5, 5] } 
        } 
    }
  }), [darkMode]);

  const filterInputClass = `w-full p-2.5 text-sm rounded-lg border font-medium focus:ring-1 focus:ring-[#6C5DD3] focus:outline-none transition-colors cursor-pointer outline-none ${darkMode ? 'bg-[#25252d] border-gray-600 text-white focus:border-[#6C5DD3] hover:bg-[#2c2c35]' : 'bg-white border-gray-200 text-gray-700 focus:border-[#6C5DD3] hover:bg-blue-50 hover:border-blue-300'}`;

  // ==========================================
  // RENDER UI
  // ==========================================
  return (
    <div className="flex h-screen w-full bg-[#1c1c24] overflow-hidden font-sans">
      
      {/* ✅ COMPONENT TOASTER (Wajib ada biar notif muncul) */}
      <Toaster />

      <Sidebar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          username="Admin UIB" 
          role="SUPER ADMIN"
      />

      <div className={`flex-1 flex flex-col h-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className={`flex-1 m-0 flex flex-col min-w-0 overflow-hidden relative shadow-[-10px_0_30px_rgba(0,0,0,0.3)] rounded-l-[40px] ${darkMode ? 'bg-[#13131a]' : 'bg-[#f4f7fe]'}`}>
            
            <main className="flex-1 overflow-y-auto p-6 space-y-5 min-w-0">
                {/* Header Page */}
                <div className="flex justify-between items-end mb-2 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div>
                        <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dashboard</h1>
                        <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Overview & Statistics</p>
                    </div>
                </div>

                {/* Filter Section */}
                <div className={`p-5 rounded-2xl border shadow-sm transition-all duration-500 ${darkMode ? 'bg-[#1c1c24] border-gray-700' : 'bg-white border-white'}`}>
                    <div className="flex items-center mb-4">
                        <div className={`p-1.5 rounded-lg mr-2 ${darkMode ? 'bg-[#2c2c35]' : 'bg-purple-50 text-[#6C5DD3]'}`}><Icons.Filter /></div>
                        <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Filter Data</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative group">
                            <select value={filterInputs.prodi} onChange={(e) => setFilterInputs({...filterInputs, prodi: e.target.value})} className={filterInputClass}>
                                <option>Semua Program Studi</option>
                                <option>Akuntansi</option>
                                <option>Manajemen</option>
                                <option>Sistem Informasi</option>
                                <option>Teknologi Informasi</option>
                                <option>Ilmu Hukum</option>
                                <option>Pariwisata</option>
                                <option>Biologi</option>
                                <option>Teknik Sipil</option>
                            </select>
                        </div>
                        <div className="relative group">
                            <select value={filterInputs.tahun} onChange={(e) => setFilterInputs({...filterInputs, tahun: e.target.value})} className={filterInputClass}>
                                <option>Semua Tahun</option>
                                <option>2025</option>
                                <option>2024</option>
                                <option>2023</option>
                                <option>2022</option>
                                <option>2021</option>
                                <option>2020</option>
                            </select>
                        </div>
                        <div className="relative group">
                            <input type="number" placeholder="Min Score" value={filterInputs.minScore} onChange={(e) => setFilterInputs({...filterInputs, minScore: e.target.value})} className={filterInputClass} />
                        </div>
                    </div>
                    <button onClick={handleTampilkan} className="w-full mt-4 py-2.5 bg-gradient-to-r from-[#6C5DD3] to-[#8B72EA] text-white text-xs font-bold rounded-xl shadow-lg hover:scale-[1.01] active:scale-95 transition-all">Tampilkan Analitik</button>
                </div>

                {/* CONTENT (SHOW IF SEARCHED) */}
                {hasSearched ? (
                    <div className="space-y-5 animate-in slide-in-from-bottom-2 fade-in duration-500">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard title="Total Mahasiswa" value={stats.total} icon={Icons.Users} color="bg-blue-500" darkMode={darkMode} />
                            <StatCard title="Rata-rata Skor" value={stats.avg} icon={Icons.Score} color="bg-[#6C5DD3]" darkMode={darkMode} />
                            <StatCard title="Kelulusan" value={stats.passRate} icon={Icons.Check} color="bg-teal-500" isPercent darkMode={darkMode} />
                        </div>

                        {/* Chart */}
                        <div className={`rounded-2xl border p-5 shadow-sm ${darkMode ? 'bg-[#1c1c24] border-gray-700' : 'bg-white border-white'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Grafik Kelulusan</h2>
                            </div>
                            <div className="h-64 w-full relative">
                                {isClient ? <Bar data={chartDataComputed} options={chartOptions as any} /> : <div className="w-full h-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"></div>}
                            </div>
                        </div>

                        {/* Table Component */}
                        <StudentsTable 
                            data={filteredStudents} 
                            sortConfig={sortConfig} 
                            requestSort={requestSort} 
                            darkMode={darkMode} 
                        />
                    </div>
                ) : (
                    // Empty State
                    <div className={`flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed transition-colors ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className={`p-3 rounded-full mb-3 animate-bounce ${darkMode ? 'bg-[#2c2c35] text-purple-400' : 'bg-purple-50 text-[#6C5DD3]'}`}><Icons.Filter /></div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Silakan pilih filter dan klik "Tampilkan Analitik".</p>
                    </div>
                )}
            </main>
        </div>
      </div>
    </div>
  );
}