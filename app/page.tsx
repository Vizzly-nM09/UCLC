'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // ✅ Pakai fungsi bawaan NextAuth
import { Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Opsional jika mau toast error

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // ✅ Panggil NextAuth Credentials
      const res = await signIn('credentials', {
        email: username, // Sesuaikan dengan field di auth.ts (email/username)
        password: password,
        redirect: false, // Kita handle redirect manual biar mulus
      });

      if (res?.error) {
        setError('Login Gagal! Periksa Username/Password.');
        setIsLoading(false);
      } else {
        // Redirect ke dashboard dengan query param untuk trigger toast sukses
        router.push('/dashboard?login=success');
        router.refresh(); // Refresh agar session terupdate
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
      setIsLoading(false);
    }
  };

  return (
    // Background dengan gradasi halus agar tidak "polos"
    <div className="flex items-center justify-center min-h-screen bg-[#121212] font-sans p-4 relative overflow-hidden">
      
      {/* Dekorasi Background (Glow Effect) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />

      {/* CARD LOGIN UTAMA */}
      <div className="relative w-full max-w-md bg-[#1c1c24]/90 backdrop-blur-xl border border-white/5 rounded-[30px] p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Selamat Datang</h1>
          <p className="text-gray-400 text-sm">Masuk untuk mengakses Dashboard Admin UIB</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
            
            {/* Input Username */}
            <div className="group">
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#6C5DD3] transition-colors">
                    <User size={20} />
                 </div>
                 <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#25252d] text-white text-sm py-4 pl-12 pr-4 rounded-xl border border-transparent outline-none focus:border-[#6C5DD3] focus:ring-1 focus:ring-[#6C5DD3] transition-all placeholder-gray-600"
                    placeholder="Username / Email"
                    required
                 />
               </div>
            </div>

            {/* Input Password */}
            <div className="group">
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#6C5DD3] transition-colors">
                    <Lock size={20} />
                 </div>
                 <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#25252d] text-white text-sm py-4 pl-12 pr-4 rounded-xl border border-transparent outline-none focus:border-[#6C5DD3] focus:ring-1 focus:ring-[#6C5DD3] transition-all placeholder-gray-600"
                    placeholder="Password"
                    required
                 />
               </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Button Login */}
            <button 
              disabled={isLoading} 
              className={`mt-2 w-full bg-gradient-to-r from-[#6C5DD3] to-[#8B72EA] text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/20 hover:shadow-purple-500/40 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110'}`}
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Masuk Dashboard'}
            </button>
        </form>

      </div>
    </div>
  );
}