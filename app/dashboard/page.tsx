'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';

// Import Internal
import { useTheme } from '@/app/context/ThemeContext';
import { Icons } from '@/lib/icons'; // ✅ Pastikan namanya icons (jamak)
import { StatCard } from './_components/stat-card';
import { StudentsTable, initialDummyData } from '../../components/ui/table/student-table';

// 🔴 EDIT: PINDAHKAN REGISTRASI INI KE lib/chart-setup.ts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
// ------------------------------------------------------------

function DashboardContent() {
  const [isClient, setIsClient] = useState(false);
  const { darkMode } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔴 LOGIKA DATA (INI HARUS DIPINDAH KE hooks/use-dashboard.ts)
  // Semua state di bawah ini adalah "Otak" aplikasi.
  const [students, setStudents] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterInputs, setFilterInputs] = useState({ prodi: 'Semua Program Studi', tahun: 'Semua Tahun', minScore: '' });
  const [activeFilters, setActiveFilters] = useState({ prodi: 'Semua Program Studi', tahun: 'Semua Tahun', minScore: '' });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // 🔴 INISIALISASI DATA (PINDAH KE HOOK)
  // Logic penggabungan dummy data & localStorage sangat "berisik" di dalam file UI.
  useEffect(() => {
    setIsClient(true);
    const localData = JSON.parse(localStorage.getItem('studentsData') || '[]');
    const uniqueData = Array.from(new Map([...initialDummyData, ...localData].map(item => [item.id, item])).values());
    setStudents(uniqueData);

    const initialFilters = {
      prodi: searchParams.get('prodi') || 'Semua Program Studi',
      tahun: searchParams.get('tahun') || 'Semua Tahun',
      minScore: searchParams.get('min') || ''
    };
    setFilterInputs(initialFilters);
    setActiveFilters(initialFilters);

    if (searchParams.get('login') === 'success') {
      toast.success("Login Berhasil!");
      router.replace('/dashboard');
      setHasSearched(true);
    } else if (searchParams.get('prodi') || searchParams.get('tahun') || uniqueData.length > 0) {
      setHasSearched(true);
    }
  }, [searchParams, router]);

  // 🔴 LOGIKA PERHITUNGAN (PINDAH KE HOOK)
  // Perhitungan filter dan statistik adalah matematika murni, tidak butuh HTML.
  const filteredStudents = useMemo(() => {
    let data = students.filter((s) => {
      if (activeFilters.prodi !== 'Semua Program Studi' && s.prodi !== activeFilters.prodi) return false;
      const year = s.date.split(' ')[2];
      if (activeFilters.tahun !== 'Semua Tahun' && year !== activeFilters.tahun) return false;
      if (activeFilters.minScore && s.score < parseInt(activeFilters.minScore)) return false;
      return true;
    });
    // ... logic sort tetap di sini sampai dipindah ke hook
    return data;
  }, [students, activeFilters, sortConfig]);

  const statsData = useMemo(() => {
    const total = filteredStudents.length;
    const avg = total > 0 ? Math.round(filteredStudents.reduce((a, b) => a + Number(b.score), 0) / total) : 0;
    // Kalkulasi rate kelulusan...
    return [
      { title: "Total Mahasiswa", value: total, icon: Icons.Users, color: "bg-blue-500" },
      { title: "Rata-rata Skor", value: avg, icon: Icons.Score, color: "bg-[#6C5DD3]" },
      { title: "Kelulusan", value: 0, icon: Icons.Check, color: "bg-teal-500", isPercent: true },
    ];
  }, [filteredStudents]);

  // 🟢 UI HELPERS (TETAP DI SINI)
  const filterInputClass = `w-full p-2.5 text-sm rounded-lg border font-medium outline-none transition-all ${darkMode ? 'bg-[#25252d] border-gray-600 text-white focus:border-purple-500' : 'bg-white border-gray-200 focus:border-[#6C5DD3]'}`;

  return (
    <div className="p-6 space-y-5 animate-in fade-in duration-500">
      <Toaster />
      {/* Semua di bawah ini adalah UI/Tampilan murni */}
      {/* ... (Header, Filter Card, Stats Grid, Table) ... */}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}