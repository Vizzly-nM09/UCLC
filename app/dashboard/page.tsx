'use client'; 

// ✅ 1. Tambahkan Suspense di sini
import React, { useState, useEffect, useMemo, useRef, memo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ✅ IMPORT THEME AGAR SINKRON
import { useTheme } from '@/app/context/ThemeContext';

// ✅ IMPORT CHART COMPONENTS
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

// ✅ IMPORT LAINNYA
import toast, { Toaster } from 'react-hot-toast';
import { StudentsTable, initialDummyData } from '../../components/ui/table/student-table';

// Registrasi Chart.js (Wajib agar grafik muncul)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- COMPONENT: ANIMATED NUMBER (Efek Angka Jalan) ---
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
// 2. LOGIC DASHBOARD DIPINDAHKAN KE SINI
// (Nama komponen diganti jadi DashboardContent)
// ==========================================
function DashboardContent() {
  const [isClient, setIsClient] = useState(false);
  
  // ✅ AMBIL DARK MODE DARI GLOBAL (Layout)
  const { darkMode } = useTheme();
  
  const [students, setStudents] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterInputs, setFilterInputs] = useState({ prodi: 'Semua Program Studi', tahun: 'Semua Tahun', minScore: '' });
  const [activeFilters, setActiveFilters] = useState({ prodi: 'Semua Program Studi', tahun: 'Semua Tahun', minScore: '' });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  const router = useRouter();
  // INI PENYEBAB ERROR BUILD SEBELUMNYA (Sekarang aman karena di dalam Suspense)
  const searchParams = useSearchParams();

  // --- INITIAL LOAD ---
  useEffect(() => { 
      setIsClient(true); 
      
      // ✅ GABUNGKAN DATA DUMMY (Kevin Li, dll) AGAR GRAFIK LANGSUNG MUNCUL
      const localData = JSON.parse(localStorage.getItem('studentsData') || '[]');
      const allData = [...initialDummyData, ...localData]; 
      
      // Hapus duplikat berdasarkan ID jika ada
      const uniqueData = Array.from(new Map(allData.map(item => [item.id, item])).values());
      
      setStudents(uniqueData);

      const initialData = { 
          prodi: searchParams.get('prodi') || 'Semua Program Studi', 
          tahun: searchParams.get('tahun') || 'Semua Tahun', 
          minScore: searchParams.get('min') || '' 
      };
      setFilterInputs(initialData); 
      setActiveFilters(initialData);
      
      // Logic Login Success
      if (searchParams.get('login') === 'success') {
          toast.success("Login Berhasil!", { id: 'login-success' });
          router.replace('/dashboard'); 
          setHasSearched(true); // Langsung tampilkan konten saat login sukses
      } 
      // Logic Jika URL sudah ada filter (misal refresh halaman)
      else if (searchParams.get('prodi') || searchParams.get('tahun') || students.length > 0) {
          // Default: Tampilkan data jika sudah ada students (dummy)
          setHasSearched(true);
      }
  }, [searchParams, router]);

  const handleTampilkan = () => {
    const params = new URLSearchParams();
    if (filterInputs.prodi !== 'Semua Program Studi') params.set('prodi', filterInputs.prodi);
    if (filterInputs.tahun !== 'Semua Tahun') params.set('tahun', filterInputs.tahun);
    if (filterInputs.minScore) params.set('min', filterInputs.minScore);
    router.push(`?${params.toString()}`);
    setActiveFilters(filterInputs);
    setHasSearched(true);
    toast.success("Data diperbarui!");
  };

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

  const stats = useMemo(() => {
      const total = filteredStudents.length;
      const totalScore = filteredStudents.reduce((acc, curr) => acc + Number(curr.score), 0);
      const avg = total > 0 ? Math.round(totalScore / total) : 0;
      const passed = filteredStudents.filter(s => s.score >= (s.type === 'TOEIC' ? 600 : s.type === 'TOEFL ITP' ? 500 : 80)).length;
      const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
      return { total, avg, passRate };
  }, [filteredStudents]);

  // --- LOGIC CHART DATA ---
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
        legend: { position: 'top' as const, align: 'end' as const, labels: { color: darkMode ? '#ffffff' : '#666666', usePointStyle: true, boxWidth: 6, font: { size: 10 } } }, 
        title: { display: false } 
    },
    scales: { 
        x: { grid: { display: false }, ticks: { color: darkMode ? '#aaaaaa' : '#666666', font: { size: 10 } } }, 
        y: { beginAtZero: true, ticks: { color: darkMode ? '#aaaaaa' : '#666666', precision: 0, font: { size: 10 } }, grid: { color: darkMode ? '#333333' : '#e5e5e5', borderDash: [5, 5] } } 
    }
  }), [darkMode]);

  const filterInputClass = `w-full p-2.5 text-sm rounded-lg border font-medium focus:ring-1 focus:ring-[#6C5DD3] outline-none ${darkMode ? 'bg-[#25252d] border-gray-600 text-white' : 'bg-white border-gray-200'}`;

  // ==========================================
  // RENDER UI
  // ==========================================
  return (
    <div className="p-6 space-y-5 animate-in fade-in duration-500">
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-end mb-2">
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
               {/* Inputs */}
               <div className="relative group">
                  <select value={filterInputs.prodi} onChange={(e) => setFilterInputs({...filterInputs, prodi: e.target.value})} className={filterInputClass}>
                      <option>Semua Program Studi</option>
                      <option>Akuntansi</option>
                      <option>Sistem Informasi</option>
                      <option>Teknologi Informasi</option>
                      <option>Manajemen</option>
                  </select>
              </div>
              <div className="relative group">
                  <select value={filterInputs.tahun} onChange={(e) => setFilterInputs({...filterInputs, tahun: e.target.value})} className={filterInputClass}>
                      <option>Semua Tahun</option>
                      <option>2025</option>
                      <option>2024</option>
                  </select>
              </div>
              <div className="relative group">
                  <input type="number" placeholder="Min Score" value={filterInputs.minScore} onChange={(e) => setFilterInputs({...filterInputs, minScore: e.target.value})} className={filterInputClass} />
              </div>
          </div>
          <button onClick={handleTampilkan} className="w-full mt-4 py-2.5 bg-gradient-to-r from-[#6C5DD3] to-[#8B72EA] text-white text-xs font-bold rounded-xl shadow-lg hover:scale-[1.01] active:scale-95 transition-all">Tampilkan Analitik</button>
      </div>

      {/* Content */}
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

              {/* Table */}
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
    </div>
  );
}

// ==========================================
// 3. KOMPONEN WRAPPER (DEFAULT EXPORT BARU)
// ==========================================
export default function DashboardPage() {
  return (
    // Fallback UI yang simpel (tampil sekejap saat load query params)
    <Suspense fallback={
      <div className="p-6 flex items-center justify-center h-screen w-full">
        <div className="flex flex-col items-center gap-3">
           <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
           <span className="text-gray-500 text-sm font-medium">Memuat Dashboard...</span>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
// bagian ini dibuat terpisah biar tidak kepanjangan, maybe nanti bisa dipindah ke file lain