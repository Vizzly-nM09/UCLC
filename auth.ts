// auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: any;
  }
}


export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email || (credentials as any)?.email) as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        try {
          // HUBUNGKAN KE BACKEND ASLI ANDA
          console.log("Login attempt:", { email, url: process.env.NEXT_PUBLIC_API_URL }); 
          const res = await fetch(`http://192.168.203.10:8080/v1/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password, 
            }),
            headers: { "Content-Type": "application/json" },
          });
          console.log("Login response:", res);

          const user = await res.json();

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
    signIn: "/", 
  },
  secret: "jHyqo3/15vQXMhgGSwhIacIQuQIC+X6ZvmI6BNh12QA=",
});