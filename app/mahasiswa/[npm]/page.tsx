'use client';

import React, { useMemo, use } from 'react'; 
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

// --- IMPORT UI COMPONENTS ---
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table"; 

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

// =========================================================================
// DATA DUMMY
// =========================================================================
const DUMMY_DATABASE = [
  {
    npm: '2532042', 
    name: 'Kevin Li',
    prodi: 'Teknologi Informasi',
    angkatan: '2025',
    status: 'Aktif',
    history: [
      { id: 1, date: '09 Aug 2025', test: 'Mid Semester', type: 'Prediction', listening: 485, reading: 470, total: 955 },
      { id: 2, date: '08 Nov 2025', test: 'Final Exam', type: 'Official', listening: 490, reading: 490, total: 980 },
    ]
  },
  {
    npm: '2025001', 
    name: 'Andi Saputra',
    prodi: 'Akuntansi',
    angkatan: '2025',
    status: 'Aktif',
    history: [
      { id: 1, date: '12 Jan 2025', test: 'Placement Test', type: 'Prediction', listening: 400, reading: 400, total: 800 },
    ]
  },
  // ... (Data dummy lainnya tetap sama)
];

const FALLBACK_DATA = {
    npm: 'Unknown', name: 'Data Tidak Ditemukan', prodi: '-', angkatan: '-', status: '-', history: []
};

// =========================================================================
// SUB-KOMPONEN (Bersih dari Dark Mode)
// =========================================================================

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border flex items-center w-fit ${className}`}>
    {children}
  </span>
);

const InfoCard = ({ label, value, icon: Icon }: any) => (
  <div className="p-4 rounded-xl border border-gray-200 bg-white text-gray-800 shadow-sm transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-medium mb-1 uppercase tracking-wider text-gray-500">{label}</p>
            <p className="text-lg font-bold tracking-tight">{value}</p>
          </div>
          <div className="p-2 rounded-lg bg-gray-100 text-gray-400 group-hover:text-[#6C5DD3] transition-colors">
             <Icon size={18} />
          </div>
      </div>
  </div>
);

function HistoryTable({ data }: { data: any[] }) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100 text-[#6C5DD3]">
              <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-800">Riwayat Ujian Lengkap</h3>
            <p className="text-xs text-gray-500">Daftar semua tes yang pernah diikuti mahasiswa ini.</p>
          </div>
        </div>
  
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="w-[180px] font-bold text-xs uppercase tracking-wider text-gray-600">Tanggal</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-600">Nama Tes</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-gray-600">Jenis</TableHead>
                <TableHead className="text-center font-bold text-xs uppercase tracking-wider text-gray-600">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((h: any) => (
                <TableRow key={h.id} className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors">
                  <TableCell className="text-xs font-medium text-gray-900">{h.date}</TableCell>
                  <TableCell className="text-xs font-medium">{h.test}</TableCell>
                  <TableCell>
                    <Badge className={h.type === 'Official' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}>
                        {h.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-bold text-[#6C5DD3]">{h.total}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
}

// =========================================================================
// MAIN PAGE
// =========================================================================
export default function StudentDetailPage({ params }: { params: Promise<{ npm: string }> }) {
  const resolvedParams = use(params); 
  const npm = resolvedParams.npm;

  const studentData = useMemo(() => {
     const found = DUMMY_DATABASE.find((mhs) => mhs.npm === npm);
     return found || { ...FALLBACK_DATA, npm: npm }; 
  }, [npm]);

  const chartData = {
    labels: studentData.history?.map((h:any) => h.date) || [],
    datasets: [{
      label: 'Total Score',
      data: studentData.history?.map((h:any) => h.total) || [],
      borderColor: '#6C5DD3', 
      backgroundColor: 'rgba(108, 93, 211, 0.05)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#6C5DD3',
      pointRadius: 5,
    }],
  };

  return (
    <div className="min-h-screen w-full p-6 font-sans bg-[#F9FAFB] text-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Detail Mahasiswa</h1>
                <p className="text-sm mt-1 text-gray-500">
                    Analisis performa skor ujian untuk NPM <span className="font-mono text-[#6C5DD3] font-bold">#{npm}</span>
                </p>
            </div>
            <div className="px-4 py-1.5 rounded-full text-sm font-bold border bg-green-50 text-green-700 border-green-200 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600"></div>
                Status: {studentData.status}
            </div>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard label="Nama Lengkap" value={studentData.name} icon={User} />
            <InfoCard label="NPM" value={studentData.npm} icon={Hash} />
            <InfoCard label="Program Studi" value={studentData.prodi} icon={GraduationCap} />
            <InfoCard label="Angkatan" value={studentData.angkatan} icon={Calendar} />
        </div>

        {/* CHART SECTION */}
        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm h-80">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-sm text-gray-800">Grafik Perkembangan Skor</h3>
                <div className="p-2 bg-purple-50 text-[#6C5DD3] rounded-lg"><TrendingUp size={18} /></div>
            </div>
            <div className="h-56 w-full">
                <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
        </div>

        {/* TABLE */}
        <HistoryTable data={studentData.history} />
      </div>
    </div>
  );
}