'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Facebook, Github, Linkedin, Eye, EyeOff, Loader2 } from 'lucide-react';

// --- DUMMY DATABASE ---
const dummyUsers = [
  { username: 'alan', password: '123' },
  { username: 'patrick', password: '123' },
  { username: 'admin', password: '123' },
];

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // State Login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const user = dummyUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
     router.push('/dashboard?login=success'); 
    } else {
      setError('Username atau password salah!');
      setIsLoading(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Fitur registrasi belum aktif. Silakan login dengan akun dummy.");
  };

  return (
    // --- UPDATE: Background dibuat permanen gelap (#121212) ---
    <div className="flex items-center justify-center min-h-screen bg-[#121212] font-sans p-4">
      
      {/* --- CONTAINER UTAMA (Card) --- */}
      {/* --- UPDATE: Card background dibuat permanen gelap (#1c1c24) --- */}
      <div className={`relative overflow-hidden w-[850px] max-w-full min-h-[550px] bg-[#1c1c24] rounded-[30px] shadow-[0_14px_28px_rgba(0,0,0,0.5),0_10px_10px_rgba(0,0,0,0.22)] transition-all duration-500`}>
        
        {/* FORM SIGN UP (KIRI) */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 flex items-center justify-center z-10
          ${isSignUp ? 'translate-x-full opacity-100 z-50' : 'opacity-0'}
        `}>
          <form onSubmit={handleRegister} className="bg-[#1c1c24] flex flex-col items-center justify-center h-full w-full px-10 text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Create Account</h1>
        
            <span className="text-xs text-gray-400 mb-6">or use your email for registration</span>
            <InputGroup icon={User} type="text" placeholder="Name" />
            <InputGroup icon={Mail} type="email" placeholder="Email" />
            <InputGroup icon={Lock} type="password" placeholder="Password" />
            <button className="mt-4 bg-[#6C5DD3] text-white text-xs font-bold py-3 px-12 rounded-full uppercase tracking-wider hover:bg-[#5a4cb3] active:scale-95 transition-transform shadow-lg shadow-purple-900/30">Sign Up</button>
          </form>
        </div>

        {/* FORM SIGN IN (KANAN) */}
        <div className={`absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 z-20 flex items-center justify-center
          ${isSignUp ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        `}>
          <form onSubmit={handleLogin} className="bg-[#1c1c24] flex flex-col items-center justify-center h-full w-full px-10 text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Sign in</h1>
           
            {/* Input Username */}
            <div className="relative w-full mb-4 group text-left">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <User size={18} />
               </div>
               {/* --- UPDATE: Input background gelap & text putih --- */}
               <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#25252d] border-none text-sm w-full py-3 pl-10 pr-3 rounded-lg outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-white placeholder-gray-500"
                  placeholder="Username"
                  required
               />
            </div>

            {/* Input Password */}
            <div className="relative w-full mb-2 group text-left">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
               </div>
               {/* --- UPDATE: Input background gelap & text putih --- */}
               <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#25252d] border-none text-sm w-full py-3 pl-10 pr-10 rounded-lg outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-white placeholder-gray-500"
                  placeholder="Password"
                  required
               />
               <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#6C5DD3] cursor-pointer">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
            </div>

            {error && <div className="w-full text-left mb-2 animate-in fade-in"><span className="text-xs text-red-400 font-semibold ml-1">⚠️ {error}</span></div>}
            
            <a href="#" className="text-xs text-gray-400 mt-2 mb-6 hover:underline hover:text-[#6C5DD3] w-full text-right">Forgot your password?</a>
            
            <button disabled={isLoading} className={`bg-[#6C5DD3] text-white text-xs font-bold py-3 px-12 rounded-full uppercase tracking-wider transition-all shadow-lg shadow-purple-900/30 flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#5a4cb3] active:scale-95 hover:shadow-purple-500/50'}`}>
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* OVERLAY PANEL (SLIDING) - Tetap Ungu */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-100 ${isSignUp ? '-translate-x-full' : ''}`}>
          <div className={`bg-gradient-to-r from-[#6C5DD3] to-[#8B72EA] text-white relative -left-full h-full w-[200%] transform transition-transform duration-600 ease-in-out ${isSignUp ? 'translate-x-1/2' : 'translate-x-0'}`}>
            <div className={`absolute top-0 flex flex-col items-center justify-center w-1/2 h-full px-10 text-center transform transition-transform duration-600 ease-in-out ${isSignUp ? 'translate-x-0' : '-translate-x-[20%]'}`}>
              <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
              <p className="text-sm mb-8 leading-relaxed font-light text-purple-100">To keep connected with us please login with your personal info</p>
              <button onClick={() => { setIsSignUp(false); setError(''); }} className="bg-transparent border border-white text-white text-xs font-bold py-3 px-12 rounded-full uppercase tracking-wider hover:bg-white hover:text-[#6C5DD3] transition-all active:scale-95">Sign In</button>
            </div>
            <div className={`absolute top-0 right-0 flex flex-col items-center justify-center w-1/2 h-full px-10 text-center transform transition-transform duration-600 ease-in-out ${isSignUp ? 'translate-x-[20%]' : 'translate-x-0'}`}>
              <h1 className="text-3xl font-bold mb-4">Hello, Friend!</h1>
              <p className="text-sm mb-8 leading-relaxed font-light text-purple-100">Enter your personal details and start journey with us</p>
              <button onClick={() => { setIsSignUp(true); setError(''); }} className="bg-transparent border border-white text-white text-xs font-bold py-3 px-12 rounded-full uppercase tracking-wider hover:bg-white hover:text-[#6C5DD3] transition-all active:scale-95">Sign Up</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- KOMPONEN KECIL (Update warna untuk dark mode permanen) ---


const InputGroup = ({ icon: Icon, type, placeholder }: any) => (
  <div className="relative w-full mb-4 group text-left">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Icon size={18} /></div>
    {/* Update input background dan text color jadi gelap */}
    <input type={type} placeholder={placeholder} className="bg-[#25252d] border-none text-sm w-full py-3 pl-10 pr-3 rounded-lg outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all text-white placeholder-gray-500" />
  </div>
);