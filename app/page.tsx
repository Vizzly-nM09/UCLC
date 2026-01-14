'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

// 📂 app/page.tsx (Bagian handleLogin)
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    const res = await signIn('credentials', {
      email: email, // Pastikan state ini berisi email .edu Anda
      password: password,
      redirect: false,
    });

    if (res?.error) {
      setError('Login Gagal! Pastikan Email dan Password benar.');
      setIsLoading(false);
    } else {
      toast.success("Login Berhasil!");
      router.push('/dashboard'); // Langsung masuk dashboard
      router.refresh();
    }
  } catch (err) {
    setError('Terjadi kesalahan koneksi ke server.');
    setIsLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212] p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-md bg-[#1c1c24]/90 backdrop-blur-xl border border-white/5 rounded-[30px] p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to UCLC</h1>
          <p className="text-gray-400 text-sm">Please insert your email and password here</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="relative">
            <User className="absolute left-4 top-4 text-gray-500" size={20} />
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#25252d] text-white py-4 pl-12 pr-4 rounded-xl outline-none focus:ring-1 focus:ring-[#6C5DD3]"
              placeholder="Email"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-500" size={20} />
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#25252d] text-white py-4 pl-12 pr-4 rounded-xl outline-none focus:ring-1 focus:ring-[#6C5DD3]"
              placeholder="Password"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-3 rounded-lg">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#6C5DD3] to-[#8B72EA] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}