// 📂 app/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // Nama provider, muncul di UI default (jika dipakai)
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Logic Login disini
      authorize: async (credentials) => {
        try {
          // 1. Validasi input dasar
          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          // 2. Fetch ke Backend API kamu (sesuaikan URL-nya)
          // Contoh: const res = await fetch("https://api.kampus.ac.id/login", { ... })
          
          // --- SIMULASI MOCK DATA (Ganti dengan Fetch API aslimu) ---
          const user = {
            id: "1",
            name: "Admin UCLC",
            email: "admin@uclc.ac.id",
            role: "ADMIN", // Custom field (perlu setup types, lihat langkah 3)
            accessToken: "dummy-jwt-token-from-backend",
          };

          // 3. Cek hasil dari backend
          if (user) {
            // Berhasil login -> Return object user
            return user;
          } else {
            // Gagal login
            return null;
          }
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      },
    }),
  ],
  // Callback untuk mengatur Token & Session
  callbacks: {
    // 1. JWT Callback: Jalan saat login sukses. Kita simpan data user ke token.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    // 2. Session Callback: Jalan saat client butuh data session. Kita copy dari token ke session.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // Extend type session di langkah 3 agar tidak error TypeScript
        (session.user as any).role = token.role; 
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/', // Redirect jika unauthenticated (Custom Login Page)
  },
  secret: process.env.AUTH_SECRET, // Wajib ada di .env
});