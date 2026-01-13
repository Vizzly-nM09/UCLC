// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "alan",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // HUBUNGKAN KE BACKEND ASLI ANDA
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: "POST",
            body: JSON.stringify({
              username: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const user = await res.json();

          // Jika backend mengembalikan user + token
          if (res.ok && user) {
            return user; // Pastikan user berisi accessToken & refreshToken
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Jalankan saat pertama kali login
      if (user) {
        return {
          ...token,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          accessTokenExpires: Date.now() + (user as any).expiresIn * 1000,
          user,
        };
      }

      // Jika token belum expired, gunakan yang lama
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Jika expired, panggil fungsi refresh (logika ini bisa ditambahkan nanti)
      return token; 
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.user = token.user as any;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Arahkan ke halaman login kamu (root)
  },
  secret: process.env.AUTH_SECRET,
});