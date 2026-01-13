// middleware.ts
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isDashboardPage = nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage = nextUrl.pathname === "/"; // Halaman login kamu

  // 1. Jika mencoba akses dashboard tapi belum login, lempar ke "/"
  if (isDashboardPage && !isLoggedIn) {
    return Response.redirect(new URL("/", nextUrl));
  }

  // 2. Jika sudah login tapi masih di halaman login, lempar ke dashboard
  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  return;
});

// Menentukan folder mana saja yang diproses middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};