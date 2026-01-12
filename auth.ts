import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // --- LOGIC LOGIN SEDERHANA (Hardcode) ---
        // Nanti bisa diganti pakai Database Prisma kalau sudah siap
        
        const users = [
            { id: "1", name: "Alan", email: "alan", password: "123", role: "admin" },
            { id: "2", name: "Patrick", email: "patrick", password: "123", role: "user" },
            { id: "3", name: "Admin UIB", email: "admin", password: "123", role: "superadmin" },
        ];

        const user = users.find(
            (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          // Kembalikan data user agar tersimpan di session
          return user; 
        }

        return null; // Login gagal
      },
    }),
  ],
  pages: {
    signIn: "/", // Kalau user belum login, tendang ke halaman depan
  },
  callbacks: {
    // Callback ini supaya Role & ID user terbawa ke browser/session
    async jwt({ token, user }) {
      if (user) {
        // token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.role = token.role
        // @ts-ignore
        session.user.id = token.id
      }
      return session
    },
  },
})