// auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user?: any;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = (credentials?.email || (credentials as any)?.username) as string;
        const password = credentials?.password as string;

        if (!username || !password) return null;

        try {
          // HUBUNGKAN KE BACKEND ASLI ANDA
          console.log("Login attempt:", { username, url: process.env.NEXT_PUBLIC_API_URL });
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: "POST",
            body: JSON.stringify({
              username,
              password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            console.error("Login failed:", res.status, await res.text());
            return null;
          }

          const data = await res.json();

          // Jika backend mengembalikan user + token
          if (res.ok && data) {
            return data; // Pastikan user berisi accessToken & refreshToken
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
          user: (user as any).user,
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