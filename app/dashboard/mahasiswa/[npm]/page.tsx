'use client';

import React, { useMemo, use } from 'react'; 
import Link from 'next/link';

// ✅ 1. IMPORT THEME CONTEXT (Agar sinkron dengan Sidebar)
// Pastikan path ini sesuai dengan lokasi file ThemeContext.tsx kamu
import { useTheme } from '@/app/context/ThemeContext'; 

// --- IMPORT ICONS ---
import { 
  Calendar, FileText, Award, Ear, BookOpen, 
  CheckCircle2, AlertCircle, TrendingUp, User, Hash, GraduationCap
} from "lucide-react";

// --- IMPORT CHART ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// --- IMPORT SHADCN TABLE ---
// Pastikan kamu sudah punya komponen UI table dari Shadcn
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; 

// --- REGISTRASI CHART ---
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

// =========================================================================
// 2. DATA DUMMY (DATABASE SIMULASI)
// =========================================================================
const DUMMY_DATABASE = [
  {
    npm: '2532042', 
    name: 'Kevin Li',
    prodi: 'Teknologi Informasi',
    angkatan: '2025',
    status: 'Aktif',
    history: [
      { id: 1, date: '09 Aug 2025', test: 'Mid Semester', type: 'Prediction', jenis: 'TOEIC', listening: 485, reading: 470, total: 955 },
      { id: 2, date: '08 Nov 2025', test: 'Final Exam', type: 'Official', jenis: 'TOEIC', listening: 490, reading: 490, total: 980 },
    ]
  },
  {
    npm: '2025001', 
    name: 'Andi Saputra',
    prodi: 'Akuntansi',
    angkatan: '2025',
    status: 'Aktif',
    history: [
      { id: 1, date: '12 Jan 2025', test: 'Placement Test', type: 'Prediction', jenis: 'TOEIC', listening: 400, reading: 400, total: 800 },
    ]
  },
  {
    npm: '2025002', 
    name: 'Budi Santoso',
    prodi: 'Sistem Informasi',
    angkatan: '2025',
    status: 'Percobaan',
    history: [
      { id: 1, date: '10 Jan 2025', test: 'Initial Test', type: 'Prediction', jenis: 'TOEFL ITP', listening: 40, reading: 40, total: 400 },
      { id: 2, date: '15 Jan 2025', test: 'Remedial 1', type: 'Official', jenis: 'TOEFL ITP', listening: 45, reading: 45, total: 450 },
    ]
  },
  {
    npm: '2025003', 
    name: 'Rina Melati',
    prodi: 'Manajemen',
    angkatan: '2025',
    status: 'Aktif',
    history: [
      { id: 1, date: '20 Jan 2025', test: 'International Cert', type: 'Official', jenis: 'TOEFL iBT', listening: 26, reading: 25, total: 95 },
    ]
  },
  {
    npm: '2025004', 
    name: 'Doni Tata',
    prodi: 'Teknologi Informasi',
    angkatan: '2025',
    status: 'Cuti',
    history: [
      { id: 1, date: '10 Feb 2025', test: 'Certification', type: 'Official', jenis: 'TOEFL ITP', listening: 55, reading: 58, total: 580 },
    ]
  },
];

const FALLBACK_DATA = {
    npm: 'Unknown', name: 'Data Tidak Ditemukan', prodi: '-', angkatan: '-', status: '-', history: []
};

// =========================================================================
// 3. KOMPONEN UI KECIL (Internal Components)
// =========================================================================

// Badge Component
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border flex items-center w-fit ${className}`}>
    {children}
  </span>
);

// Info Card Component
const InfoCard = ({ label, value, icon: Icon, darkMode }: any) => (
  <div className={`p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 group
    ${darkMode 
      ? 'bg-[#25252d] border-gray-700 text-white' 
      : 'bg-white border-gray-200 text-gray-800 shadow-sm'
    }`}>
      <div className="flex justify-between items-start">
          <div>
            <p className={`text-xs font-medium mb-1 uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
            <p className="text-lg font-bold tracking-tight">{value}</p>
          </div>
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-400'} group-hover:text-[#6C5DD3] transition-colors`}>
             <Icon size={18} />
          </div>
      </div>
  </div>
);

// History Table Component
function HistoryTable({ data, darkMode }: { data: any[], darkMode: boolean }) {
    return (
      <div className={`rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 mt-6 ${
        darkMode ? 'bg-[#1c1c24] border-gray-700' : 'bg-white border-white'
      }`}>
        
        {/* Header Table Section */}
        <div className={`p-5 border-b flex items-center gap-3 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="p-2 rounded-lg bg-purple-100 text-[#6C5DD3]">
              <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Riwayat Ujian Lengkap
            </h3>
            <p className="text-xs text-gray-500">Daftar semua tes yang pernah diikuti mahasiswa ini.</p>
          </div>
        </div>
  
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className={darkMode ? 'bg-[#25252d]' : 'bg-gray-50/50'}>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="w-[180px] font-bold text-xs uppercase tracking-wider">
                    <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> Tanggal</div>
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">
                    <div className="flex items-center gap-2"><FileText className="w-3 h-3" /> Nama Tes</div>
                </TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider">Jenis</TableHead>
                <TableHead className="text-center font-bold text-xs uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><Ear className="w-3 h-3" /> L</div>
                </TableHead>
                <TableHead className="text-center font-bold text-xs uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><BookOpen className="w-3 h-3" /> R</div>
                </TableHead>
                <TableHead className="text-center font-bold text-xs uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1"><Award className="w-3 h-3" /> Total</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              {data && data.length > 0 ? (
                data.map((h: any) => (
                  <TableRow 
                      key={h.id} 
                      className={`border-b transition-colors ${
                          darkMode ? 'border-gray-800 hover:bg-[#2c2c35]' : 'border-gray-100 hover:bg-purple-50/30'
                      }`}
                  >
                    <TableCell className="font-medium text-xs">
                        <div className="flex flex-col">
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>{h.date}</span>
                            <span className="text-[10px] text-muted-foreground">09:00 AM</span>
                        </div>
                    </TableCell>
                    
                    <TableCell className="text-xs font-medium">
                        {h.test}
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={
                          h.type === 'Official' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                          : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                      }>
                          {h.type === 'Official' ? <CheckCircle2 className="w-3 h-3 mr-1 inline" /> : <AlertCircle className="w-3 h-3 mr-1 inline" />}
                          {h.type}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-center text-xs text-muted-foreground">
                        {h.listening}
                    </TableCell>
                    
                    <TableCell className="text-center text-xs text-muted-foreground">
                        {h.reading}
                    </TableCell>
                    
                    <TableCell className="text-center">
                        <span className={`text-sm font-bold ${
                            h.total >= 800 ? 'text-emerald-500' : 
                            h.total >= 600 ? 'text-[#6C5DD3]' : 'text-orange-500'
                        }`}>
                            {h.total}
                        </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-xs">
                    Belum ada riwayat ujian.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

// =========================================================================
// 4. MAIN PAGE EXPORT
// =========================================================================
export default function StudentDetailPage({ params }: { params: Promise<{ npm: string }> }) {
  
  // Unwrap Params (Next.js 15)
  const resolvedParams = use(params); 
  const npm = resolvedParams.npm;

  // ✅ AMBIL DARK MODE DARI CONTEXT (Bukan state lokal lagi)
  const { darkMode } = useTheme();

  // --- LOGIKA MENCARI DATA ---
  const studentData = useMemo(() => {
     const found = DUMMY_DATABASE.find((mhs) => mhs.npm === npm);
     return found || { ...FALLBACK_DATA, npm: npm }; 
  }, [npm]);

  // --- LOGIKA CHART ---
  const chartData = useMemo(() => {
    return {
      labels: studentData.history?.length > 0 ? studentData.history.map((h:any) => h.date) : ['No Data'],
      datasets: [
        {
          label: 'Total Score',
          data: studentData.history?.length > 0 ? studentData.history.map((h:any) => h.total) : [0],
          borderColor: '#6C5DD3', 
          backgroundColor: 'rgba(108, 93, 211, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#6C5DD3',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };
  }, [studentData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: darkMode ? '#25252d' : '#fff', // Ikut Dark Mode Context
        titleColor: darkMode ? '#fff' : '#333',
        bodyColor: darkMode ? '#fff' : '#666',
        borderColor: darkMode ? '#444' : '#ddd',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: darkMode ? '#888' : '#666' } },
      y: { 
        grid: { color: darkMode ? '#333' : '#f0f0f0', borderDash: [5, 5] }, 
        ticks: { color: darkMode ? '#888' : '#666' },
        min: 0, 
      }
    }
  };

  return (
    // Class text akan otomatis mengikuti Dark Mode dari Layout/Context
    <div className={`min-h-screen w-full p-6 font-sans transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER & BREADCRUMB */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#6C5DD3] mb-1">
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Detail Mahasiswa</h1>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Analisis performa skor ujian untuk NPM <span className="font-mono text-[#6C5DD3] font-bold">#{npm}</span>
                </p>
            </div>
            
            {/* Status Badge */}
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border flex items-center gap-2 ${
                studentData.status === 'Aktif' || studentData.status === 'Lulus'
                ? 'bg-green-100 text-green-700 border-green-200' 
                : 'bg-red-100 text-red-700 border-red-200'
            }`}>
                <div className={`w-2 h-2 rounded-full ${studentData.status === 'Aktif' || studentData.status === 'Lulus' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                Status: {studentData.status}
            </div>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-2 fade-in duration-500 delay-100">
            <InfoCard label="Nama Lengkap" value={studentData.name} icon={User} darkMode={darkMode} />
            <InfoCard label="NPM" value={studentData.npm} icon={Hash} darkMode={darkMode} />
            <InfoCard label="Program Studi" value={studentData.prodi} icon={GraduationCap} darkMode={darkMode} />
            <InfoCard label="Angkatan" value={studentData.angkatan} icon={Calendar} darkMode={darkMode} />
        </div>

        {/* CHART SECTION */}
        <div className={`p-6 rounded-2xl border shadow-sm h-80 animate-in slide-in-from-bottom-3 fade-in duration-500 delay-200 
            ${darkMode ? 'bg-[#25252d] border-gray-700' : 'bg-white border-white'}`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-sm">Grafik Perkembangan Skor</h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Tren kenaikan skor dari waktu ke waktu</p>
                </div>
                <div className="p-2 bg-purple-50 text-[#6C5DD3] rounded-lg">
                    <TrendingUp size={18} />
                </div>
            </div>
            
            <div className="h-56 w-full">
                {studentData.history && studentData.history.length > 0 ? (
                    <Line data={chartData} options={chartOptions as any} />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
                        Belum ada data history ujian.
                    </div>
                )}
            </div>
        </div>

        {/* TABLE COMPONENT */}
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300">
            <HistoryTable data={studentData.history} darkMode={darkMode} />
        </div>

      </div>
    </div>
  );
}