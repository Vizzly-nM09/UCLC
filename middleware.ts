// middleware.ts
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");

  // Logika: Jika mencoba akses dashboard tapi belum login, lempar ke login
  if (isDashboardPage && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

// Jalankan middleware HANYA pada route dashboard
export const config = {
  matcher: ["/dashboard/:path*"],
};