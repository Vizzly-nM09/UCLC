'use client';

// ✅ Import 'use' untuk menangani Params di Next.js terbaru
import React, { useState, useMemo, use } from 'react'; 
import Link from 'next/link';
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

// --- REGISTRASI CHART ---
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

// =========================================================================
// 1. DATABASE YANG SUDAH DISINKRONKAN DENGAN TABEL
// =========================================================================
const DUMMY_DATABASE = [
  // 1. KEVIN LI (Data Demo Kamu)
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
  // 2. ANDI SAPUTRA (Lulus)
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
  // 3. BUDI SANTOSO (Gagal - Skor Rendah)
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
  // 4. RINA MELATI (Lulus - TOEFL iBT)
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
  // 5. DONI TATA (Lulus)
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

// --- KOMPONEN KECIL ---
const InfoCard = ({ label, value, darkMode }: { label: string, value: string, darkMode: boolean }) => (
  <div className={`p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 
    ${darkMode 
      ? 'bg-[#25252d] border-gray-700 text-white' 
      : 'bg-white border-gray-200 text-gray-800 shadow-sm'
    }`}>
      <p className={`text-xs font-medium mb-1 uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
      <p className="text-lg font-bold tracking-tight">{value}</p>
  </div>
);

// =========================================================================
// MAIN PAGE
// =========================================================================
export default function StudentDetailPage({ params }: { params: Promise<{ npm: string }> }) {
  
  // ✅ FIX: UNWRAP PARAMS (Agar tidak error saat compile)
  const resolvedParams = use(params); 
  const npm = resolvedParams.npm;

  const [darkMode, setDarkMode] = useState(false); 

  // --- LOGIKA MENCARI DATA ---
  const studentData = useMemo(() => {
     const found = DUMMY_DATABASE.find((mhs) => mhs.npm === npm);
     return found || { ...FALLBACK_DATA, npm: npm }; 
  }, [npm]);

  // --- LOGIKA CHART ---
  const chartData = useMemo(() => {
    return {
      labels: studentData.history.length > 0 ? studentData.history.map(h => h.date) : ['No Data'],
      datasets: [
        {
          label: 'Total Score',
          data: studentData.history.length > 0 ? studentData.history.map(h => h.total) : [0],
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
        backgroundColor: darkMode ? '#25252d' : '#fff',
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
    <div className={`min-h-screen w-full p-6 font-sans transition-colors duration-300 ${darkMode ? 'bg-[#1c1c24] text-white' : 'bg-[#f4f7fe] text-gray-800'}`}>
      
      <button onClick={() => setDarkMode(!darkMode)} className="fixed bottom-5 right-5 z-50 bg-[#6C5DD3] text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold hover:scale-105 transition-transform">
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#6C5DD3] mb-1">
                    <Link href="/dashboard" className="hover:underline">Dashboard</Link> 
                    <span>/</span> 
                    <span>Mahasiswa</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Detail Mahasiswa</h1>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Analisis performa skor ujian untuk NPM <span className="font-mono text-[#6C5DD3] font-bold">#{npm}</span>
                </p>
            </div>
            
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
                studentData.status === 'Aktif' || studentData.status === 'Lulus'
                ? 'bg-green-100 text-green-700 border-green-200' 
                : 'bg-red-100 text-red-700 border-red-200'
            }`}>
                Status: {studentData.status}
            </div>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-2 fade-in duration-500 delay-100">
            <InfoCard label="Nama Lengkap" value={studentData.name} darkMode={darkMode} />
            <InfoCard label="NPM" value={studentData.npm} darkMode={darkMode} />
            <InfoCard label="Program Studi" value={studentData.prodi} darkMode={darkMode} />
            <InfoCard label="Angkatan" value={studentData.angkatan} darkMode={darkMode} />
        </div>

        {/* CHART */}
        <div className={`p-6 rounded-2xl border shadow-sm h-80 animate-in slide-in-from-bottom-3 fade-in duration-500 delay-200 
            ${darkMode ? 'bg-[#25252d] border-gray-700' : 'bg-white border-white'}`}>
            <h3 className="font-bold mb-4">Grafik Perkembangan Skor</h3>
            <div className="h-60 w-full">
                {studentData.history.length > 0 ? (
                    <Line data={chartData} options={chartOptions as any} />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
                        Belum ada data history ujian.
                    </div>
                )}
            </div>
        </div>

        {/* TABLE */}
        <div className={`rounded-2xl border shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300
            ${darkMode ? 'bg-[#25252d] border-gray-700' : 'bg-white border-white'}`}>
            <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-bold">Riwayat Ujian Lengkap</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className={`text-xs uppercase font-semibold ${darkMode ? 'bg-[#1c1c24] text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                        <tr>
                            <th className="px-6 py-4">Tanggal</th>
                            <th className="px-6 py-4">Nama Tes</th>
                            <th className="px-6 py-4">Jenis</th>
                            <th className="px-6 py-4 text-center">L</th>
                            <th className="px-6 py-4 text-center">R</th>
                            <th className="px-6 py-4 text-center">Total</th>
                        </tr>
                    </thead>
                    <tbody className={darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-100'}>
                        {studentData.history.length > 0 ? (
                            studentData.history.map((h) => (
                                <tr key={h.id} className={`transition-colors ${darkMode ? 'hover:bg-[#2c2c35]' : 'hover:bg-gray-50'}`}>
                                    <td className="px-6 py-4 font-medium">{h.date}</td>
                                    <td className="px-6 py-4">{h.test}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${h.type === 'Official' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                            {h.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-500">{h.listening}</td>
                                    <td className="px-6 py-4 text-center text-gray-500">{h.reading}</td>
                                    <td className="px-6 py-4 text-center font-bold text-[#6C5DD3]">{h.total}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-400 italic">Tidak ada data ditemukan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}