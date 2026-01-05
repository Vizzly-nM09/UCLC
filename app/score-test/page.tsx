'use client'; 

import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

// --- INTERFACES ---
interface FormData {
  npm: string;
  nama: string;
  prodi: string; // Tambahan field
  jenisTes: string;
  tipeTes: string;
  tanggalUjian: string;
  nilaiReading: number;
  nilaiStructure: number;
  nilaiListening: number;
  keterangan: 'lulus' | 'gagal';
}

// --- ICONS ---
const Icons = {
    CheckCircle: () => <svg className="w-6 h-6 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    XCircle: () => <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    Spinner: () => (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    ),
    Save: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
};

// --- KOMPONEN INPUT ---
const FloatingInput = ({ label, register, name, type = "text", errors, darkMode, ...rest }: any) => (
    <div className="relative group">
        <input 
            type={type}
            id={name}
            {...register(name, rest)}
            className={`peer block w-full appearance-none rounded-xl border-2 px-4 pt-5 pb-2 text-sm font-medium focus:outline-none focus:ring-0 transition-all duration-300
                ${errors[name] ? 'border-red-500 text-red-900 focus:border-red-500' : 'border-gray-200 focus:border-[#6C5DD3]'}
                ${darkMode ? 'bg-[#25252d] border-gray-600 text-white placeholder-transparent focus:border-[#6C5DD3]' : 'bg-white text-gray-900 placeholder-transparent'}
            `}
            placeholder=" " 
        />
        <label 
            htmlFor={name}
            className={`absolute left-4 top-4 z-10 origin-[0] -translate-y-3 scale-75 transform text-xs duration-300 
                peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
                peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:font-bold
                ${errors[name] ? 'text-red-500' : 'text-gray-500 peer-focus:text-[#6C5DD3]'}
            `}
        >
            {label}
        </label>
        {errors[name] && (
            <p className="mt-1 text-xs text-red-500 animate-in slide-in-from-top-1 fade-in duration-300 ml-1 flex items-center gap-1">
               <Icons.XCircle /> {errors[name]?.message}
            </p>
        )}
    </div>
);

export default function ScoreTest() {
  const [darkMode, setDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>();

  // --- LOGIKA SIMPAN DATA KE LOCALSTORAGE ---
  const onSubmit = async (data: FormData) => { 
      try {
          await new Promise((resolve) => setTimeout(resolve, 1500)); // Efek loading palsu

          // 1. Hitung Total Score (Sederhana)
          const totalScore = Number(data.nilaiReading) + Number(data.nilaiStructure) + Number(data.nilaiListening);

          // 2. Format Tanggal agar cantik "12 Jan 2025"
          const dateObj = new Date(data.tanggalUjian);
          const formattedDate = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

          // 3. Buat Object Data Baru
          const newStudent = {
              id: Date.now(), // ID unik dari timestamp
              name: data.nama,
              prodi: data.prodi,
              type: data.jenisTes === 'toefl' ? 'TOEFL ITP' : 'TOEIC', // Simplifikasi
              score: totalScore,
              reading: data.nilaiReading,
              structure: data.nilaiStructure,
              listening: data.nilaiListening,
              status: data.keterangan === 'lulus' ? 'Lulus' : 'Gagal',
              date: formattedDate
          };

          // 4. Ambil data lama dari LocalStorage, gabung, lalu simpan lagi
          const existingData = JSON.parse(localStorage.getItem('studentsData') || '[]');
          const updatedData = [newStudent, ...existingData];
          localStorage.setItem('studentsData', JSON.stringify(updatedData));

          // 5. Redirect ke Dashboard
          router.push('/dashboard?new=true'); // Parameter ini bisa buat trigger notif di dashboard

      } catch (error) {
          alert("Gagal menyimpan data.");
      }
  };

  const selectClass = `w-full px-4 py-3 border-2 rounded-xl focus:ring-0 focus:outline-none transition-colors duration-300 text-sm font-medium cursor-pointer appearance-none
    ${darkMode ? 'bg-[#25252d] border-gray-600 text-white focus:border-[#6C5DD3]' : 'bg-white border-gray-200 text-gray-900 focus:border-[#6C5DD3]'}`;

  const labelSelectClass = `block text-xs font-bold mb-2 ml-1 uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`;

  // --- LAYOUT NESTED CONTAINER ---
  return (
    <div className="flex h-screen w-full bg-[#1c1c24] overflow-hidden font-sans">
      
      <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`flex-1 flex flex-col h-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        
        <div className={`
            flex-1 m-0 flex flex-col overflow-hidden relative shadow-[-10px_0_30px_rgba(0,0,0,0.3)]
            rounded-l-[40px]
            ${darkMode ? 'bg-[#13131a]' : 'bg-[#f4f7fe]'}
        `}>
            
            <main className="flex-1 overflow-y-auto p-8 space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-end mb-4 animate-in fade-in slide-in-from-left-4 duration-700">
                    <div>
                        <h1 className={`text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>Score Test</h1>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Input hasil tes terbaru mahasiswa</p>
                    </div>
                </div>

                {/* FORMULIR CARD */}
                <div className={`rounded-3xl shadow-lg border p-8 transition-all duration-500 ${darkMode ? 'bg-[#1c1c24] border-gray-700' : 'bg-white border-white'}`}>
                    <div className="flex items-center gap-3 mb-8 border-b pb-4 border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-10 h-10 rounded-full bg-[#6C5DD3] flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </div>
                        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Formulir Input Data</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* SECTION 1: DATA MAHASISWA */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FloatingInput 
                                label="NPM Mahasiswa" name="npm" register={register} errors={errors} darkMode={darkMode}
                                pattern={{ value: /^[0-9]+$/, message: "Angka saja" }} minLength={{ value: 5, message: "Min 5 digit" }} required="Wajib diisi"
                            />
                            <FloatingInput 
                                label="Nama Lengkap" name="nama" register={register} errors={errors} darkMode={darkMode} required="Wajib diisi"
                            />
                            <div className="relative">
                                <label className={labelSelectClass}>Program Studi</label>
                                <select {...register('prodi', { required: true })} className={selectClass}>
                                    <option value="">Pilih Prodi...</option>
                                    <option value="Akuntansi">Akuntansi</option>
                                    <option value="Manajemen">Manajemen</option>
                                    <option value="Sistem Informasi">Sistem Informasi</option>
                                    <option value="Teknologi Informasi">Teknologi Informasi</option>
                                    <option value="Ilmu Hukum">Ilmu Hukum</option>
                                    <option value="Pariwisata">Pariwisata</option>
                                    <option value="Biologi">Biologi</option>
                                    <option value="Teknik Sipil">Teknik Sipil</option>
                                </select>
                            </div>
                        </div>

                        {/* SECTION 2: DETAIL TES */}
                        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#25252d] border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className={labelSelectClass}>Jenis Tes</label>
                                    <select {...register('jenisTes', { required: true })} className={selectClass}>
                                        <option value="toefl">TOEFL</option>
                                        <option value="toeic">TOEIC</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelSelectClass}>Tipe Tes</label>
                                    <select {...register('tipeTes', { required: true })} className={selectClass}>
                                        <option value="prediction">Prediction</option>
                                        <option value="official">Official</option>
                                    </select>
                                </div>
                                <FloatingInput 
                                    label="Tanggal Ujian" name="tanggalUjian" type="date" register={register} errors={errors} darkMode={darkMode} required="Wajib diisi"
                                />
                            </div>
                        </div>

                        {/* SECTION 3: SKOR */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FloatingInput label="Reading Score" name="nilaiReading" type="number" register={register} errors={errors} darkMode={darkMode} required="Wajib" min={{ value: 0, message: "Min 0" }} />
                            <FloatingInput label="Structure Score" name="nilaiStructure" type="number" register={register} errors={errors} darkMode={darkMode} required="Wajib" min={{ value: 0, message: "Min 0" }} />
                            <FloatingInput label="Listening Score" name="nilaiListening" type="number" register={register} errors={errors} darkMode={darkMode} required="Wajib" min={{ value: 0, message: "Min 0" }} />
                        </div>

                        {/* SECTION 4: STATUS & TOMBOL */}
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">

                            {/* Action Buttons */}
                            <div className="flex gap-4 w-full md:w-auto">
                                <button type="button" onClick={() => reset()} disabled={isSubmitting} className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                                    Reset
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className={`px-9 py-3 rounded-xl font-bold shadow-xl shadow-purple-500/30 flex items-center gap-2 transition-all duration-300 transform active:scale-95
                                        ${isSubmitting ? 'bg-gray-400 cursor-not-allowed text-gray-200' : 'bg-[#6C5DD3] text-white hover:bg-[#5b4eb8] hover:-translate-y-1'}
                                    `}
                                >
                                    {isSubmitting ? <><Icons.Spinner /> Menyimpan...</> : <><Icons.Save /> Simpan Data</>}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

            </main>
        </div>
      </div>
    </div>
  );
}