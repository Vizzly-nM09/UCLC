'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

// --- IMPORT DARI SHADCN ---
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table"; 

// --- DATA DUMMY ---
export const initialDummyData = [
  // TAHUN 2025
  { id: 1, npm: '2025001', name: 'Andi Saputra', prodi: 'Akuntansi', type: 'TOEIC', score: 800, reading: 400, structure: 0, listening: 400, status: 'Lulus', date: '12 Jan 2025' },
  { id: 2, npm: '2025002', name: 'Budi Santoso', prodi: 'Sistem Informasi', type: 'TOEFL ITP', score: 450, reading: 45, structure: 45, listening: 45, status: 'Gagal', date: '15 Jan 2025' },
  { id: 3, npm: '2025003', name: 'Rina Melati', prodi: 'Manajemen', type: 'TOEFL iBT', score: 95, reading: 25, structure: 24, listening: 26, status: 'Lulus', date: '20 Jan 2025' },
  { id: 4, npm: '2025004', name: 'Doni Tata', prodi: 'Teknologi Informasi', type: 'TOEFL ITP', score: 580, reading: 58, structure: 60, listening: 55, status: 'Lulus', date: '10 Feb 2025' },
  
  // DEMO USER
  { id: 99, npm: '2532042', name: 'Kevin Li', prodi: 'Teknologi Informasi', type: 'TOEIC', score: 955, reading: 485, structure: 0, listening: 470, status: 'Lulus', date: '09 Aug 2025' }, 
];

// --- ICONS ---
const Icons = {
    SortUp: () => <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>,
    SortDown: () => <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>,
    SearchEmpty: () => <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    SearchIcon: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
};

interface StudentsTableProps {
    data: any[];
    sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
    requestSort: (key: string) => void;
    darkMode: boolean;
}

export const StudentsTable = ({ data, sortConfig, requestSort, darkMode }: StudentsTableProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter((student) => 
            student.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    // ✅ UPDATE: 'Aksi' Pindah ke Depan (Index 0)
    const tableHeaders = [' ',  'NPM', 'Nama', 'Prodi', 'Tipe', 'Score', 'Read', 'Struct', 'Listen', 'Status', 'Tanggal'];
    const tableKeys = ['action', 'npm', 'name', 'prodi', 'type', 'score', 'reading', 'structure', 'listening', 'status', 'date'];

    return (
        <div className={`rounded-2xl border shadow-sm overflow-hidden transition-all duration-500 ${darkMode ? 'bg-[#1c1c24] border-gray-700' : 'bg-white border-white'}`}>
            
            {/* Header Card */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Hasil Pencarian <span className="text-[#6C5DD3] text-xs ml-2 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">{filteredData.length} Data</span>
                </h2>

                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Icons.SearchIcon />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Cari nama depan..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`block w-full p-2 pl-10 text-xs rounded-lg border outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all
                            ${darkMode 
                                ? 'bg-[#25252d] border-gray-600 text-white placeholder-gray-500 focus:border-[#6C5DD3]' 
                                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#6C5DD3]'
                            }
                        `}
                    />
                </div>
            </div>
            
            <div className="w-full overflow-x-auto pb-2">
                <Table>
                    <TableHeader>
                        <TableRow className={`text-[10px] uppercase tracking-wider border-none
                            ${darkMode 
                                ? 'bg-gradient-to-r from-[#2c2c35] to-[#1c1c24] text-gray-300' 
                                : 'bg-gradient-to-r from-black-200 to-black-100 text-[#2b2556]'
                            }
                        `}>
                            {tableHeaders.map((head, i) => {
                                const isAction = head === 'Aksi';
                                return (
                                    <TableHead 
                                        key={i} 
                                        className={`h-11 px-4 font-bold cursor-pointer transition-colors whitespace-nowrap group
                                            ${darkMode ? 'hover:text-white' : 'hover:text-[#6C5DD3]'}
                                            ${i === 0 ? 'rounded-l-lg text-center' : ''} 
                                            ${i === tableHeaders.length - 1 ? 'rounded-r-lg' : ''}
                                        `}
                                        onClick={() => !isAction && requestSort(tableKeys[i])}
                                    >
                                        <div className={`flex items-center gap-1 ${isAction ? 'justify-center' : ''}`}>
                                            {head} 
                                            {!isAction && (
                                                sortConfig?.key === tableKeys[i] ? (
                                                    sortConfig.direction === 'asc' ? <Icons.SortUp/> : <Icons.SortDown/>
                                                ) : (
                                                    <div className={`transition-opacity opacity-0 group-hover:opacity-100 ${darkMode ? 'text-gray-500' : 'text-[#6C5DD3]/50'}`}>
                                                        <Icons.SortDown/>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    </TableHeader>

                    <TableBody className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {filteredData.length > 0 ? (
                            filteredData.map((mhs, idx) => (
                                <TableRow 
                                    key={mhs.id} 
                                    className={`
                                        transition-all duration-300 border-b animate-in slide-in-from-bottom-1 fade-in
                                        ${darkMode ? 'border-gray-800 hover:bg-[#2c2c35]' : 'border-gray-50 hover:bg-purple-50'}
                                    `}
                                    style={{ animationDelay: `${idx * 30}ms` }}
                                >
                                    
                                    {/* ✅ 1. CELL AKSI (SEKARANG DI DEPAN) */}
                                    <TableCell className="px-4 py-3 text-center">
                                        <Link href={`/mahasiswa/${mhs.npm}`}>
                                            <div className={`inline-flex items-center justify-center p-2 rounded-lg border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5
                                                ${darkMode 
                                                    ? 'bg-[#25252d] border-gray-700 text-gray-400 hover:text-white hover:border-[#6C5DD3]' 
                                                    : 'bg-white border-gray-200 text-gray-500 hover:text-[#6C5DD3] hover:border-[#6C5DD3]'
                                                }`}
                                            >
                                                <Icons.Eye />
                                            </div>
                                        </Link>
                                    </TableCell>

                                    {/* 2. CELL NPM */}
                                    <TableCell className={`px-4 py-3 font-medium whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{mhs.npm}</TableCell>

                                    {/* 3. CELL NAMA */}
                                    <TableCell className={`px-4 py-3 font-bold whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-800'}`}>{mhs.name}</TableCell>
                                    
                                    <TableCell className="px-4 py-3 whitespace-nowrap text-muted-foreground">{mhs.prodi}</TableCell>
                                    
                                    <TableCell className="px-4 py-3 whitespace-nowrap">
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border 
                                            ${mhs.type === 'TOEIC' ? 'bg-purple-50 text-purple-600 border-purple-200' : 
                                              mhs.type === 'TOEFL ITP' ? 'bg-sky-50 text-sky-600 border-sky-200' : 
                                              'bg-pink-50 text-pink-600 border-pink-200'}
                                        `}>
                                            {mhs.type}
                                        </span>
                                    </TableCell>

                                    <TableCell className={`px-4 py-3 font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{mhs.score}</TableCell>
                                    <TableCell className="px-4 py-3 text-muted-foreground">{mhs.reading}</TableCell>
                                    <TableCell className="px-4 py-3 text-muted-foreground">{mhs.structure}</TableCell>
                                    <TableCell className="px-4 py-3 text-muted-foreground">{mhs.listening}</TableCell>

                                    <TableCell className="px-4 py-3 whitespace-nowrap">
                                        <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold w-fit ${mhs.status === 'Lulus' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${mhs.status === 'Lulus' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            {mhs.status}
                                        </span>
                                    </TableCell>
                                    
                                    <TableCell className="px-4 py-3 whitespace-nowrap text-muted-foreground">{mhs.date}</TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={11} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center opacity-50">
                                        <Icons.SearchEmpty />
                                        <p className="text-gray-500 font-medium text-xs mt-2">
                                            {searchTerm ? `Tidak ada nama yang berawalan "${searchTerm}"` : 'Tidak ada data yang cocok.'}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};